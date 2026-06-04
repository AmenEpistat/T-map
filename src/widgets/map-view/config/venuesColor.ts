import type { MapCategory } from '@/entities/map';
import type { Color } from '@deck.gl/core';

export const VENUES_COLOR: Record<MapCategory, Color> = {
    food: [225, 140, 30],
    entertainment: [165, 110, 190],
    shopping: [10, 150, 190],
} as const;
