import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { type HEX, type RGB, type HSL, color } from './color';

export const POST = (async ({ request }) => {
	const input = await request.json(),
		output: any = {};

	if (!input.base || typeof input.base != 'string') {
		throw error(400, 'Invalid input');
	}

	// const min = input.min ? input.min : 25,
	// 	max = input.max ? input.max : 75,
	// 	steps = input.steps ? input.steps : 10,
	// 	luminosities = createSteps(min, max, steps);

	// output.test = generatePalette(input.base, luminosities);

	output.hexValidate = color.hex.validate(input.base);
	output.hexParse = color.hex.parse(input.base);
	output.hexToString = color.hex.toString(output.hexParse);
	output.hexToRgb = color.hex.toRgb(output.hexParse);
	output.hexToHsl = color.hex.toHsl(output.hexParse);

	output.hexString = color.getStringType(input.base);

	const rgbString = color.rgb.toString(output.hexToRgb);
	output.rgbString = color.getStringType(rgbString);

	output.rgbValidate = color.rgb.validate(rgbString);
	output.rgbParse = color.rgb.parse(rgbString);
	output.rgbToString = rgbString;
	output.rgbToHex = color.rgb.toHex(output.rgbParse);
	output.rgbToHsl = color.rgb.toHsl(output.rgbParse);

	return new Response(JSON.stringify(output), { status: 200 });
}) satisfies RequestHandler;

// function createSteps(min: number, max: number, count: number): number[] {
// 	const distance = max - min,
// 		size = distance / (count - 1),
// 		output: number[] = [];

// 	for (let step = min; step <= max; step += size) {
// 		output.push(Math.round(step));
// 	}

// 	return output;
// }

// function generatePalette(value: HEX, luminosities: number[]): HEX[] {
// 	const base = color.rgb.toHSL(color.hex.toRGB(value)),
// 		variants: HEX[] = [];

// 	for (let i = 0; i < luminosities.length; i++) {
// 		variants.push(
// 			color.rgb.toHEX(
// 				color.hsl.toRGB({ hue: base.hue, saturation: base.saturation, luminosity: luminosities[i] })
// 			)
// 		);
// 	}

// 	return variants;
// }
