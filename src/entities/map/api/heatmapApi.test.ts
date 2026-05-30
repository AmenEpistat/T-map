import { describe, it, expect, vi, beforeEach } from 'vitest';
import { heatmapApi } from './heatmapApi';
import { apiClient } from '@/shared/api';
import { RESOLUTION } from '@/entities/map';

vi.mock('@/shared/api', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/shared/api')>();

    return {
        ...actual,
        apiClient: {
            get: vi.fn(),
        },
    };
});

const mockBounds = {
    swLat: 48.1,
    swLng: 11.1,
    neLat: 48.5,
    neLng: 11.5,
};

describe('heatmapApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getClusters', () => {
        it('вызывает правильный эндпоинт', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({ clusters: [] });

            await heatmapApi.getClusters(mockBounds);

            expect(apiClient.get).toHaveBeenCalledWith('/heatmap/clusters', {
                params: {
                    ...mockBounds,
                    resolution: RESOLUTION,
                },
            });
        });

        it('возвращает данные от apiClient', async () => {
            const mockData = { clusters: [{ h3Index: 'abc' }] };
            vi.mocked(apiClient.get).mockResolvedValue(mockData);

            const result = await heatmapApi.getClusters(mockBounds);

            expect(result).toEqual(mockData);
        });

        it('пробрасывает ошибку если запрос упал', async () => {
            vi.mocked(apiClient.get).mockRejectedValue(
                new Error('Network error')
            );

            await expect(heatmapApi.getClusters(mockBounds)).rejects.toThrow(
                'Network error'
            );
        });
    });

    describe('getClusterByIndex', () => {
        it('вызывает правильный эндпоинт с h3Index', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({});

            await heatmapApi.getClusterByIndex('abc123');

            expect(apiClient.get).toHaveBeenCalledWith(
                '/heatmap/clusters/abc123',
                { params: { resolution: RESOLUTION } }
            );
        });
    });

    describe('getVenues', () => {
        it('передаёт bounds и categories', async () => {
            vi.mocked(apiClient.get).mockResolvedValue([]);
            const categories = ['food', 'sport'] as any;

            await heatmapApi.getVenues(mockBounds, categories);

            expect(apiClient.get).toHaveBeenCalledWith('/venues', {
                params: {
                    ...mockBounds,
                    category: categories,
                },
            });
        });

        it('передаёт пустой массив категорий', async () => {
            vi.mocked(apiClient.get).mockResolvedValue([]);

            await heatmapApi.getVenues(mockBounds, []);

            expect(apiClient.get).toHaveBeenCalledWith('/venues', {
                params: { ...mockBounds, category: [] },
            });
        });
    });
});
