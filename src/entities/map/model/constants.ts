import type { Bounds, MapCategory } from '@/entities/map';

export const MAP_CATEGORIES: MapCategory[] = [
    'food',
    'entertainment',
    'shopping',
] as const;

export const BOUNDS_KEYS: (keyof Bounds)[] = [
    'swLng',
    'swLat',
    'neLng',
    'neLng',
] as const;
