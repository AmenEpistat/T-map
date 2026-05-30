import type { MapCategory } from '@/entities/map';
import type { Color } from '@deck.gl/core';

export const VENUES_COLOR: Record<MapCategory, Color> = {
    food: [255, 161, 94],
    entertainment: [211, 143, 236],
    shopping: [10, 177, 220],
} as const;

