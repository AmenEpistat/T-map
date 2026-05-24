import { describe, it, expect } from 'vitest';
import { normalizeBounds, isSameBounds } from '@/entities/map';

const BASE = {
    swLat: 48.123456,
    swLng: 11.123456,
    neLat: 48.654321,
    neLng: 11.654321,
};

describe('normalizeBounds', () => {
    it('округляет до 2 знаков', () => {
        const result = normalizeBounds(BASE);
        expect(result.swLat).toBe(48.12);
        expect(result.swLng).toBe(11.12);
        expect(result.neLat).toBe(48.65);
        expect(result.neLng).toBe(11.65);
    });

    it('не мутирует входной объект', () => {
        const input = { ...BASE };
        normalizeBounds(input);
        expect(input.swLat).toBe(BASE.swLat);
    });
});

describe('isSameBounds', () => {
    it('true если сдвиг меньше порога', () => {
        expect(isSameBounds(BASE, { ...BASE, swLat: BASE.swLat })).toBe(true);
    });

    it('false если сдвиг больше порога', () => {
        expect(isSameBounds(BASE, { ...BASE, swLat: BASE.swLat + 0.01 })).toBe(
            false
        );
    });

    it('false если отличается любое из 4 полей', () => {
        expect(isSameBounds(BASE, { ...BASE, neLng: BASE.neLng + 0.01 })).toBe(
            false
        );
    });
});
