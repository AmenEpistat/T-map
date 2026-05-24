import type { Bounds } from '@/entities/map';

export const normalizeBounds = (bounds: Bounds) => {
    const f = 1e2;

    return {
        swLat: Math.round(bounds.swLat * f) / f,
        swLng: Math.round(bounds.swLng * f) / f,
        neLng: Math.round(bounds.neLng * f) / f,
        neLat: Math.round(bounds.neLat * f) / f,
    };
};

export const isSameBounds = (a: Bounds, b: Bounds) => {
    return (
        a.swLat === b.swLat &&
        a.swLng === b.swLng &&
        a.neLat === b.neLat &&
        a.neLng === b.neLng
    );
};
