import { error } from '@sveltejs/kit';

export type HEX = `#${string}`;
export type RGB = { red: number; green: number; blue: number };
export type HSL = { hue: number; saturation: number; luminosity: number };

export const color = {
	hex: {
		validate(value: HEX): HEX {
			if (!new RegExp(/^#([A-Fa-f0-9]{6}$|[A-Fa-f0-9]{3}$)/).test(value))
				throw error(400, 'Invalid hexadecimal color value.');

			if (value.slice(1).length == 3) {
				const toDouble = (index: number) => `${value.charAt(index)}${value.charAt(index)}`;
				value = `#${toDouble(1)}${toDouble(2)}${toDouble(3)}`;
			}

			return value;
		},

		toRGB(value: HEX): RGB {
			value = this.validate(value);

			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
			if (!result) throw error(500, 'Unknown error parsing hex value');

			return {
				red: parseInt(result[1], 16),
				green: parseInt(result[2], 16),
				blue: parseInt(result[3], 16)
			};
		}
	},

	rgb: {
		toHEX(value: RGB): HEX {
			const toHex = (number: number): string => number.toString(16).padStart(2, '0');
			return `#${toHex(value.red)}${toHex(value.green)}${toHex(value.blue)}`;
		},

		toHSL(value: RGB): HSL {
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
	},

	hsl: {
		toRGB(value: HSL): RGB {
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
};
