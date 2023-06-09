export type HEX = `#${string}`;
export type RGB = { red: number; green: number; blue: number };
export type HSL = { hue: number; saturation: number; luminosity: number };

class Validator {
	private readonly hexRegEx = new RegExp(/^#([A-Fa-f0-9]{6}$|[A-Fa-f0-9]{3}$)/);
	private readonly rgbRegEx = new RegExp(
		/rgb\(([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5]),([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5]),([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\)/
	);
	private readonly hslRegEx = new RegExp(
		/hsl\((\d{1,3}|[0-9]{1,2}\.[0-9]+),(\d{1,3}%|[0-9]{1,2}\.[0-9]+%),(\d{1,3}%|[0-9]{1,2}\.[0-9]+%)\)/
	);

	public getStringType(value: string | undefined | null | void): 'hex' | 'rgb' | 'hsl' | false {
		if (!value) return false;

		if (typeof value !== 'string') return false;

		if (this.hex(value)) return 'hex';

		if (this.rgb(value)) return 'rgb';

		if (this.hsl(value)) return 'hsl';

		return false;
	}

	public hex(value: string): boolean {
		return this.hexRegEx.test(value);
	}
	public rgb(value: string): boolean {
		return this.rgbRegEx.test(value);
	}
	public hsl(value: string): boolean {
		return this.hslRegEx.test(value);
	}
}

class Parser {
	private splitStr(value: string): number[] {
		const colorStrings = value
				.split('(')[1]
				.substring(0, value.length - 5)
				.split(','),
			colors: number[] = [];

		for (const string of colorStrings) {
			colors.push(Number(string));
		}

		return colors;
	}

	public hex(value: string): HEX {
		if (value.slice(1).length === 3) {
			const duplicate = (index: number) => `${value.charAt(index)}${value.charAt(index)}`;

			value = `#${duplicate(1) + duplicate(2) + duplicate(3)}`;
		}

		return value as HEX;
	}

	public rgb(value: string): RGB {
		const colors = this.splitStr(value);

		return {
			red: colors[0],
			green: colors[1],
			blue: colors[2]
		};
	}

	public hsl(value: string): HSL {
		const colors = this.splitStr(value);

		return {
			hue: colors[0],
			saturation: colors[1],
			luminosity: colors[2]
		};
	}
}

class Converter {
	public hexToRgb(value: HEX): RGB {
		return {
			red: parseInt(value.slice(1, 3), 16),
			green: parseInt(value.slice(3, 5), 16),
			blue: parseInt(value.slice(5, 7), 16)
		};
	}

	public hexToHsl(value: HEX): HSL {
		return this.rgbToHsl(this.hexToRgb(value));
	}

	public rgbToHex(value: RGB): HEX {
		return ('#' +
			value.red.toString(16).padStart(2, '0') +
			value.green.toString(16).padStart(2, '0') +
			value.blue.toString(16).padStart(2, '0')) as HEX;
	}

	public rgbToHsl(value: RGB): HSL {
		const red = value.red / 255,
			green = value.green / 255,
			blue = value.blue / 255,
			min = Math.min(red, green, blue),
			max = Math.max(red, green, blue),
			delta = max - min,
			toPositiveDegree = (value: number) => (value < 0 ? value + 360 : value);

		return {
			hue: toPositiveDegree(
				Math.round(
					(delta == 0
						? 0
						: max == red
						? ((green - blue) / delta) % 6
						: max == green
						? (blue - red) / delta + 2
						: (red - green) / delta + 4) * 60
				)
			),
			luminosity: Math.round(((max + min) / 2) * 100),
			saturation: Math.round(
				delta == 0 ? 0 : (delta / (1 - Math.abs(2 * ((max + min) / 2) - 1))) * 100
			)
		};
	}

	public hslToHex(value: HSL): HEX {
		return this.rgbToHex(this.hslToRgb(value));
	}

	public hslToRgb(value: HSL): RGB {
		const hue = value.hue,
			saturation = value.saturation / 100,
			luminosity = value.luminosity / 100,
			primaryComponent = (1 - Math.abs(2 * luminosity - 1)) * saturation,
			secondaryComponent = primaryComponent * (1 - Math.abs(((hue / 60) % 2) - 1)),
			lighten = (value: number) => Math.round((value + luminosity - primaryComponent / 2) * 255),
			range: RGB[] = [
				{
					red: primaryComponent,
					green: secondaryComponent,
					blue: 0
				},
				{
					red: secondaryComponent,
					green: primaryComponent,
					blue: 0
				},
				{
					red: 0,
					green: primaryComponent,
					blue: secondaryComponent
				},
				{
					red: 0,
					green: secondaryComponent,
					blue: primaryComponent
				},
				{
					red: secondaryComponent,
					green: 0,
					blue: primaryComponent
				},
				{
					red: primaryComponent,
					green: 0,
					blue: secondaryComponent
				}
			];

		return {
			red: lighten(range[Math.floor(hue / 60)].red),
			green: lighten(range[Math.floor(hue / 60)].green),
			blue: lighten(range[Math.floor(hue / 60)].blue)
		};
	}
}

class Stringifier {
	public hex(value: HEX): string {
		return value as string;
	}

	public rgb(value: RGB): string {
		return `rgb(${value.red},${value.green},${value.blue})`;
	}

	public hsl(value: HSL): string {
		return `hsl(${value.hue},${value.saturation},${value.luminosity})`;
	}
}

type ColorFunctions<T> = {
	validate(value: string): boolean;
	parse(value: string): T;

	toString(value: T): string;

	toHex?(value: T): HEX;
	toRgb?(value: T): RGB;
	toHsl?(value: T): HSL;
};

class HEXFunctions implements ColorFunctions<HEX> {
	private validator = new Validator();
	private parser = new Parser();
	private converter = new Converter();
	private stringifier = new Stringifier();

	public validate(value: string): boolean {
		return this.validator.hex(value);
	}

	public parse(value: string): HEX {
		return this.parser.hex(value);
	}

	public toString(value: HEX): string {
		return this.stringifier.hex(value);
	}

	public toRgb(value: HEX): RGB {
		return this.converter.hexToRgb(value);
	}

	public toHsl(value: HEX): HSL {
		return this.converter.hexToHsl(value);
	}
}

class RGBFunctions implements ColorFunctions<RGB> {
	private validator = new Validator();
	private parser = new Parser();
	private converter = new Converter();
	private stringifier = new Stringifier();

	public validate(value: string): boolean {
		return this.validator.rgb(value);
	}

	public parse(value: string): RGB {
		return this.parser.rgb(value);
	}

	public toString(value: RGB): string {
		return this.stringifier.rgb(value);
	}

	public toHex(value: RGB): HEX {
		return this.converter.rgbToHex(value);
	}

	public toHsl(value: RGB): HSL {
		return this.converter.rgbToHsl(value);
	}
}

class HSLFunctions implements ColorFunctions<HSL> {
	private validator = new Validator();
	private parser = new Parser();
	private converter = new Converter();
	private stringifier = new Stringifier();

	public validate(value: string): boolean {
		return this.validator.hsl(value);
	}

	public parse(value: string): HSL {
		return this.parser.hsl(value);
	}

	public toString(value: HSL): string {
		return this.stringifier.hsl(value);
	}

	public toHex(value: HSL): HEX {
		return this.converter.hslToHex(value);
	}

	public toRgb(value: HSL): RGB {
		return this.converter.hslToRgb(value);
	}
}

type LuminosityOptions = {
	max: number;
	min: number;
};

type SaturationOptions = {
	add: number;
	sub: number;
};

type HueOptions = {
	add: number;
	sub: number;
};

class Theme {
	public createSteps(min: number, max: number, count: number): number[] {
		const distance = max - min,
			size = Math.round(distance / (count - 1)),
			output: number[] = [];

		for (let i = 0; i <= count; i++) {
			if (i == count) {
				output.push(max);
				break;
			}

			output.push(min + i * size);
		}

		return output;
	}
	// public generatePalette<T = HEX | RGB | HSL>(
	// 	base: T,
	// 	stops: number,
	// 	luminosity: LuminosityOptions,
	// 	saturation: SaturationOptions,
	// 	hue: HueOptions
	// ): T[];
}

class Color {
	private readonly validator = new Validator();

	public getStringType(value: string | void | null) {
		return this.validator.getStringType(value);
	}

	public readonly hex = new HEXFunctions();
	public readonly rgb = new RGBFunctions();
	public readonly hsl = new HSLFunctions();
	public readonly theme = new Theme();
}

export const color = new Color();
