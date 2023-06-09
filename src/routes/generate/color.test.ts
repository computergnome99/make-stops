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
