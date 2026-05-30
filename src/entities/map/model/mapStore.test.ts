import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapStore } from './mapStore';
import { heatmapApi, isSameBounds, normalizeBounds } from '@/entities/map';
import { INITIAL_VIEW } from '@/widgets/map-view/model/constants';

vi.mock('@/entities/map', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/entities/map')>();
    return {
        ...actual,
        heatmapApi: {
            getClusters: vi.fn(),
            getClusterByIndex: vi.fn(),
            getVenues: vi.fn(),
        },
        isSameBounds: vi.fn(() => false),
        normalizeBounds: vi.fn((b) => b),
    };
});

vi.mock('@deck.gl/core', () => ({
    FlyToInterpolator: class {},
}));

const mockBounds = {
    swLat: 48.1,
    swLng: 11.1,
    neLat: 48.5,
    neLng: 11.5,
};

describe('MapStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mapStore.bounds = null;
        mapStore.viewState = INITIAL_VIEW;
        mapStore.selectedCategories = ['food', 'sport'] as any;
        mapStore.isAnomaliesVisible = false;
        mapStore.isTeamVisible = false;
        mapStore.setClusterIndex(null);
    });

    describe('setBounds', () => {
        it('устанавливает bounds', () => {
            mapStore.setBounds(mockBounds);
            expect(mapStore.bounds).toEqual(mockBounds);
        });

        it('не обновляет если bounds одинаковые', () => {
            vi.mocked(isSameBounds).mockReturnValue(true);
            mapStore.setBounds(mockBounds);
            const prev = mapStore.bounds;
            mapStore.setBounds(mockBounds);
            expect(mapStore.bounds).toBe(prev);
        });

        it('вызывает normalizeBounds', () => {
            mapStore.setBounds(mockBounds);
            expect(normalizeBounds).toHaveBeenCalledWith(mockBounds);
        });
    });

    describe('loadClusters', () => {
        it('не делает запрос без bounds', async () => {
            await mapStore.loadClusters();
            expect(heatmapApi.getClusters).not.toHaveBeenCalled();
        });

        it('делает запрос с bounds', async () => {
            mapStore.bounds = mockBounds;
            vi.mocked(heatmapApi.getClusters).mockResolvedValue({
                data: { clusters: [] },
            } as any);

            await mapStore.loadClusters();
            expect(heatmapApi.getClusters).toHaveBeenCalledWith(mockBounds);
        });

        it('абортит предыдущий запрос', async () => {
            mapStore.bounds = mockBounds;
            vi.mocked(heatmapApi.getClusters).mockResolvedValue({
                data: { clusters: [] },
            } as any);
            mapStore['clusters'].isLoading = true;

            const abortSpy = vi.fn();
            mapStore['_clusterController'] = { abort: abortSpy } as any;

            await mapStore.loadClusters();
            expect(abortSpy).toHaveBeenCalled();
        });
    });

    describe('loadVenues', () => {
        it('не делает запрос без bounds', async () => {
            await mapStore.loadVenues();
            expect(heatmapApi.getVenues).not.toHaveBeenCalled();
        });

        it('передаёт bounds и selectedCategories', async () => {
            mapStore.bounds = mockBounds;
            vi.mocked(heatmapApi.getVenues).mockResolvedValue({
                data: [],
            } as any);

            await mapStore.loadVenues();

            expect(heatmapApi.getVenues).toHaveBeenCalledWith(
                mockBounds,
                mapStore.selectedCategories
            );
        });
    });

    describe('loadClusterDetails', () => {
        it('не делает запрос без selectedClusterIndex', async () => {
            await mapStore.loadClusterDetails();
            expect(heatmapApi.getClusterByIndex).not.toHaveBeenCalled();
        });

        it('делает запрос с h3Index', async () => {
            mapStore.setClusterIndex('abc123');
            vi.mocked(heatmapApi.getClusterByIndex).mockResolvedValue({
                data: {},
            } as any);

            await mapStore.loadClusterDetails();
            expect(heatmapApi.getClusterByIndex).toHaveBeenCalledWith('abc123');
        });
    });

    describe('toggleCategory', () => {
        it('добавляет категорию если её нет', () => {
            mapStore.selectedCategories = [];
            mapStore.toggleCategory('food' as any);
            expect(mapStore.selectedCategories).toContain('food');
        });

        it('убирает категорию если есть', () => {
            mapStore.selectedCategories = ['food'] as any;
            mapStore.toggleCategory('food' as any);
            expect(mapStore.selectedCategories).not.toContain('food');
        });
    });

    describe('toggleAnomalies', () => {
        it('переключает значение', () => {
            expect(mapStore.isAnomaliesVisible).toBe(false);
            mapStore.toggleAnomalies();
            expect(mapStore.isAnomaliesVisible).toBe(true);
            mapStore.toggleAnomalies();
            expect(mapStore.isAnomaliesVisible).toBe(false);
        });
    });

    describe('toggleTeam', () => {
        it('переключает значение', () => {
            expect(mapStore.isTeamVisible).toBe(false);
            mapStore.toggleTeam();
            expect(mapStore.isTeamVisible).toBe(true);
        });
    });

    describe('zoomIn / zoomOut', () => {
        it('увеличивает зум на 1', () => {
            const prev = mapStore.viewState.zoom;
            mapStore.zoomIn();
            expect(mapStore.viewState.zoom).toBe(prev + 1);
        });

        it('не превышает максимум 18', () => {
            mapStore.viewState = { ...mapStore.viewState, zoom: 18 };
            mapStore.zoomIn();
            expect(mapStore.viewState.zoom).toBe(18);
        });

        it('уменьшает зум на 1', () => {
            const prev = mapStore.viewState.zoom;
            mapStore.zoomOut();
            expect(mapStore.viewState.zoom).toBe(prev - 1);
        });

        it('не опускается ниже 5', () => {
            mapStore.viewState = { ...mapStore.viewState, zoom: 5 };
            mapStore.zoomOut();
            expect(mapStore.viewState.zoom).toBe(5);
        });
    });

    describe('setPitch', () => {
        it('устанавливает pitch и добавляет анимацию', () => {
            mapStore.setPitch(45);
            expect(mapStore.viewState.pitch).toBe(45);
            expect(mapStore.viewState.transitionDuration).toBeDefined();
            expect(mapStore.viewState.transitionInterpolator).toBeDefined();
        });
    });

    describe('isClusterSelected', () => {
        it('false если нет выбранного', () => {
            expect(mapStore.isClusterSelected).toBe(false);
        });

        it('true если есть выбранный', () => {
            mapStore.setClusterIndex('abc');
            expect(mapStore.isClusterSelected).toBe(true);
        });
    });
});
