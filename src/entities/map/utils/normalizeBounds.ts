import type { Bounds } from '@/entities/map';

const BOUNDS_THRESHOLD = 1e-3;

export const normalizeBounds = (bounds: Bounds) => {
    const f = 1e4;

    return {
        swLat: Math.round(bounds.swLat * f) / f,
        swLng: Math.round(bounds.swLng * f) / f,
        neLng: Math.round(bounds.neLng * f) / f,
        neLat: Math.round(bounds.neLat * f) / f,
    };
};

export const isSameBounds = (a: Bounds, b: Bounds) => {
    return (
        Math.abs(a.swLat - b.swLat) < BOUNDS_THRESHOLD &&
        Math.abs(a.swLng - b.swLng) < BOUNDS_THRESHOLD &&
        Math.abs(a.neLat - b.neLat) < BOUNDS_THRESHOLD &&
        Math.abs(a.neLng - b.neLng) < BOUNDS_THRESHOLD
    );
};
