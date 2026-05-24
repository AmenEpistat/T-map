import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHeatmapData } from './useHeatmapData';
import { mapStore } from '@/entities/map';

vi.mock('@/entities/map', () => ({
    mapStore: {
        bounds: { swLat: 1 },
        selectedCategories: { slice: vi.fn(() => ['food']) },
        viewState: { zoom: 10 },
        loadClusters: vi.fn(),
        loadVenues: vi.fn(),
    },
}));

vi.mock('mobx', () => ({
    reaction: vi.fn((expression, effect) => {
        expression();
        setTimeout(effect, 500);
        return vi.fn();
    }),
}));

describe('Хук useHeatmapData', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('загружает кластеры, если уровень зума меньше ZOOM_ICON', async () => {
        mapStore.viewState.zoom = 5;
        renderHook(() => useHeatmapData());

        vi.advanceTimersByTime(500);
        expect(mapStore.loadClusters).toHaveBeenCalled();
    });

    it('загружает заведения, если уровень зума больше или равен ZOOM_ICON', async () => {
        mapStore.viewState.zoom = 18;
        renderHook(() => useHeatmapData());

        vi.advanceTimersByTime(500);
        expect(mapStore.loadVenues).toHaveBeenCalled();
    });
});
