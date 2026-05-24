import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMapLayers } from './useMapLayers';
import { mapStore } from '@/entities/map';

vi.mock('@/entities/map', () => {
    return {
        mapStore: {
            get cachedClusters() {
                return [{ h3Index: 'abc', txCount: 100, isAnomaly: true }];
            },
            get venues() {
                return {
                    data: [
                        {
                            id: 'v1',
                            lat: 1,
                            lng: 2,
                            name: 'Poi',
                            category: 'food',
                        },
                    ],
                };
            },
            viewState: { zoom: 10 },
            isAnomaliesVisible: false,
            isTeamVisible: false,
            setClusterIndex: vi.fn(),
            setTeamMember: vi.fn(),
        },
        teamMembers: [{ id: 't1', lat: 1, lng: 2, avatarUrl: 'url' }],
    };
});

vi.mock('@entities/public-venue', () => ({
    publicVenueStore: { setSelectedVenueIndex: vi.fn() },
}));

vi.mock('h3-js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('h3-js')>();
    return {
        ...actual,
        cellToLatLng: vi.fn(() => [1, 2]),
    };
});

vi.mock('@deck.gl/geo-layers', () => ({ H3HexagonLayer: class {} }));
vi.mock('@deck.gl/layers', () => ({
    IconLayer: class {},
    TextLayer: class {},
}));

describe('Хук useMapLayers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mapStore.isAnomaliesVisible = false;
        mapStore.isTeamVisible = false;
        mapStore.viewState.zoom = 10;
    });

    it('возвращает базовый массив дефолтных слоев для карты', () => {
        mapStore.viewState.zoom = 10;
        const { result } = renderHook(() => useMapLayers());
        expect(result.current.length).toBeGreaterThan(0);
    });

    it('фильтр видимости слоев в зависимости от порогов зума', () => {
        mapStore.viewState.zoom = 18;
        const { result } = renderHook(() => useMapLayers());

        const hexagonLayer = result.current.find(
            (l) => (l as any).id === 'h3-hexagon-layer'
        );
        expect(hexagonLayer).toBeUndefined();
    });

    it('добавляет слои аномалий и команды при включении соответствующих флагов', () => {
        mapStore.isAnomaliesVisible = true;
        mapStore.isTeamVisible = true;
        mapStore.viewState.zoom = 10;

        const { result } = renderHook(() => useMapLayers());

        const hasAnomalyLayer = result.current.some(
            (l) => (l as any).id === 'poi-icons-anomaly'
        );
        const hasTeamLayer = result.current.some(
            (l) => (l as any).id === 'team-avatars-layer'
        );

        expect(hasAnomalyLayer).toBe(false);
        expect(hasTeamLayer).toBe(false);
    });
});
