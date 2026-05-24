import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMapControl } from './useMapControl';
import { mapStore } from '@/entities/map';

vi.mock('@/entities/map', () => ({
    mapStore: {
        setBounds: vi.fn(),
        setViewState: vi.fn(),
    },
}));

describe('Хук useMapControl', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('обновляет границы карты при срабатывании handleMapLoad', () => {
        const { result } = renderHook(() => useMapControl());
        const mockMap = {
            getBounds: vi.fn(() => ({
                getSouthWest: () => ({ lat: 10, lng: 20 }),
                getNorthEast: () => ({ lat: 30, lng: 40 }),
            })),
        };
        result.current.mapRef.current = { getMap: () => mockMap };

        act(() => {
            result.current.handleMapLoad();
        });

        expect(mapStore.setBounds).toHaveBeenCalledWith({
            swLat: 10,
            swLng: 20,
            neLat: 30,
            neLng: 40,
        });
    });

    it('сохраняет viewState и дебаунсит обновление границ при handleViewStateChange', () => {
        const { result } = renderHook(() => useMapControl());
        const mockMap = {
            getBounds: vi.fn(() => ({
                getSouthWest: () => ({ lat: 1, lng: 2 }),
                getNorthEast: () => ({ lat: 3, lng: 4 }),
            })),
        };
        result.current.mapRef.current = { getMap: () => mockMap };

        act(() => {
            result.current.handleViewStateChange({
                viewState: { zoom: 12 },
            } as any);
        });

        expect(mapStore.setViewState).toHaveBeenCalledWith({ zoom: 12 });
        expect(mapStore.setBounds).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(mapStore.setBounds).toHaveBeenCalled();
    });
});
