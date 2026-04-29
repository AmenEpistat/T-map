import type { Bounds, MapCategory } from '@/entities/map';

export const MAP_CATEGORIES: MapCategory[] = [
    'food',
    'entertainment',
    'shopping',
] as const;

export enum MAPPING_CATEGORIES {
    food = 'Еда',
    entertainment = 'Развлечения',
    shopping = 'Шоппинг',
}

export const BOUNDS_KEYS: (keyof Bounds)[] = [
    'swLng',
    'swLat',
    'neLng',
    'neLat',
] as const;

export const RESOLUTION = 9;
