import { expect, test } from 'vitest';

import { color, type HEX, type RGB, type HSL } from './color';

// misc.
test('getStringType()', () => {
	expect(color.getStringType('#fff')).toBe('hex');
	expect(color.getStringType('rgb(255,255,255)')).toBe('rgb');
	expect(color.getStringType('hsl(0,0%,100%)')).toBe('hsl');
	expect(color.getStringType('not-a-color')).toBe(false);
	expect(color.getStringType()).toBe(false);
});

// hex
test('hex.validate()', () => {
	expect(color.hex.validate('#fff')).toBe(true);
	expect(color.hex.validate('#00fbff')).toBe(true);
	expect(color.hex.validate('#gg3344')).toBe(false);
	expect(color.hex.validate('#ffff')).toBe(false);
});

test('hex.parse()', () => {
	expect(color.hex.parse('#ffffff')).toBe<HEX>('#ffffff');
	expect(color.hex.parse('#fff')).toBe<HEX>('#ffffff');
	expect(color.hex.parse('#0bf')).toBe<HEX>('#00bbff');
});

test('hex.toString()', () => {
	expect(color.hex.toString('#ffffff')).toBe('#ffffff');
	expect(color.hex.toString('#00fbff')).toBe('#00fbff');
});

test('hex.toRgb()', () => {
	expect(color.hex.toRgb('#ffffff')).toStrictEqual<RGB>({
		red: 255,
		green: 255,
		blue: 255
	});
	expect(color.hex.toRgb('#000000')).toStrictEqual<RGB>({
		red: 0,
		green: 0,
		blue: 0
	});
	expect(color.hex.toRgb('#00fbff')).toStrictEqual<RGB>({
		red: 0,
		green: 251,
		blue: 255
	});
	expect(color.hex.toRgb('#e8c517')).toStrictEqual<RGB>({
		red: 232,
		green: 197,
		blue: 23
	});
});

test('hex.toHsl()', () => {
	expect(color.hex.toHsl('#ffffff')).toStrictEqual<HSL>({
		hue: 0,
		saturation: 0,
		luminosity: 100
	});
	expect(color.hex.toHsl('#000000')).toStrictEqual<HSL>({
		hue: 0,
		saturation: 0,
		luminosity: 0
	});
	expect(color.hex.toHsl('#00fbff')).toStrictEqual<HSL>({
		hue: 181,
		saturation: 100,
		luminosity: 50
	});
	expect(color.hex.toHsl('#e8c517')).toStrictEqual<HSL>({
		hue: 50,
		saturation: 82,
		luminosity: 50
	});
});

// rgb
test('rgb.validate()', () => {
	expect(color.rgb.validate('rgb(255,255,255)')).toBe(true);
	expect(color.rgb.validate('rgb(0,0,0)')).toBe(true);
	expect(color.rgb.validate('rgb(0,251,255)')).toBe(true);
	expect(color.rgb.validate('hsl(0,75%,60%)')).toBe(false);
});

test('rgb.parse()', () => {
	expect(color.rgb.parse('rgb(255,255,255)')).toStrictEqual<RGB>({
		red: 255,
		green: 255,
		blue: 255
	});
	expect(color.rgb.parse('rgb(0,0,0)')).toStrictEqual<RGB>({
		red: 0,
		green: 0,
		blue: 0
	});
	expect(color.rgb.parse('rgb(0,251,255)')).toStrictEqual<RGB>({
		red: 0,
		green: 251,
		blue: 255
	});
});

test('rgb.toString()', () => {
	expect(color.rgb.toString({ red: 255, green: 255, blue: 255 })).toBe('rgb(255,255,255)');
	expect(color.rgb.toString({ red: 0, green: 0, blue: 0 })).toBe('rgb(0,0,0)');
	expect(color.rgb.toString({ red: 0, green: 251, blue: 255 })).toBe('rgb(0,251,255)');
});

test('rgb.toHex()', () => {
	expect(color.rgb.toHex({ red: 255, green: 255, blue: 255 })).toBe('#ffffff');
	expect(color.rgb.toHex({ red: 0, green: 0, blue: 0 })).toBe('#000000');
	expect(color.rgb.toHex({ red: 0, green: 251, blue: 255 })).toBe('#00fbff');
});

test('rgb.toHsl()', () => {
	expect(color.rgb.toHsl({ red: 255, green: 255, blue: 255 })).toStrictEqual<HSL>({
		hue: 0,
		saturation: 0,
		luminosity: 100
	});
	expect(color.rgb.toHsl({ red: 0, green: 0, blue: 0 })).toStrictEqual<HSL>({
		hue: 0,
		saturation: 0,
		luminosity: 0
	});
	expect(color.rgb.toHsl({ red: 0, green: 251, blue: 255 })).toStrictEqual<HSL>({
		hue: 181,
		saturation: 100,
		luminosity: 50
	});
});

// hsl
test('hsl.validate()', () => {
	expect(color.hsl.validate('hsl(0,0%,100%)')).toBe(true);
	expect(color.hsl.validate('hsl(0,0%,0%)')).toBe(true);
	expect(color.hsl.validate('hsl(181,100%,50%)')).toBe(true);
	expect(color.hsl.validate('hsl(0,100,0)')).toBe(false);
	expect(color.hsl.validate('hsl(0,100,0)')).toBe(false);
	expect(color.hsl.validate('rgb(255,255,255)')).toBe(false);
	expect(color.hsl.validate('')).toBe(false);
});

test('hsl.parse()', () => {
	expect(color.hsl.parse('hsl(0,0%,100%)')).toStrictEqual<HSL>({
		hue: 0,
		saturation: 0,
		luminosity: 100
	});
	expect(color.hsl.parse('hsl(0,0%,0%)')).toStrictEqual<HSL>({
		hue: 0,
		saturation: 0,
		luminosity: 0
	});
	expect(color.hsl.parse('hsl(181,100%,50%)')).toStrictEqual<HSL>({
		hue: 181,
		saturation: 100,
		luminosity: 50
	});
});

test('hsl.toHex()', () => {
	expect(
		color.hsl.toHex({
			hue: 0,
			saturation: 0,
			luminosity: 100
		})
	).toBe('#ffffff');
	expect(
		color.hsl.toHex({
			hue: 0,
			saturation: 0,
			luminosity: 0
		})
	).toBe('#000000');
	expect(
		color.hsl.toHex({
			hue: 181,
			saturation: 100,
			luminosity: 50
		})
	).toBe('#00fbff');
});

test('hsl.toRgb()', () => {
	expect(
		color.hsl.toRgb({
			hue: 0,
			saturation: 0,
			luminosity: 100
		})
	).toStrictEqual<RGB>({
		red: 255,
		green: 255,
		blue: 255
	});
	expect(
		color.hsl.toRgb({
			hue: 0,
			saturation: 0,
			luminosity: 0
		})
	).toStrictEqual<RGB>({
		red: 0,
		green: 0,
		blue: 0
	});
	expect(
		color.hsl.toRgb({
			hue: 181,
			saturation: 100,
			luminosity: 50
		})
	).toStrictEqual<RGB>({
		red: 0,
		green: 251,
		blue: 255
	});
});

// theme
test('theme.createSteps()', () => {
	expect(color.theme.createSteps()).toStrictEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
	expect(color.theme.createSteps(20, 100, 5)).toStrictEqual([20, 40, 60, 80, 100]);
	expect(color.theme.createSteps(16, 96, 6)).toStrictEqual([16, 32, 48, 64, 80, 96]);
});
