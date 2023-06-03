// import { error } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';

const HSL_TO_HEX = ([hue, saturation, lightness]: [number, number, number]): string => {
	saturation /= 100;
	lightness /= 100;

	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation,
		secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));

	const toDouble = (number: number) => Math.round((number + lightness - chroma / 2) * 255);

	let red = 0,
		green = 0,
		blue = 0;

	switch (Math.floor(hue / 60)) {
		case 0:
			red = chroma;
			green = secondary;
			blue = 0;
			break;

		case 1:
			red = secondary;
			green = chroma;
			blue = 0;
			break;

		case 2:
			red = 0;
			green = chroma;
			blue = secondary;
			break;

		case 3:
			red = 0;
			green = secondary;
			blue = chroma;
			break;

		case 4:
			red = secondary;
			green = 0;
			blue = chroma;
			break;

		case 5:
			red = chroma;
			green = 0;
			blue = secondary;
			break;
	}

	red = toDouble(red);
	green = toDouble(green);
	blue = toDouble(blue);

	return '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
};
