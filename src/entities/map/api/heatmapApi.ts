import { apiClient } from '@/shared/api';
import type { Bounds, ClusterDataType, MapCategory } from '@/entities/map';

export const heatmapApi = {
    getClusters: async (bounds: Bounds, categories: MapCategory[]) => {
        return await apiClient.get<{ clusters: ClusterDataType[] }>(
            '/heatmap/clusters',
            {
                params: {
                    ...bounds,
                    resolution: 9,
                    window: 60,
                    categories: categories,
                },
            }
        );
    },

    getClusterByIndex: async (h3Index: string) => {
        return await apiClient.get(`/heatmap/clusters/${h3Index}`);
    },
};
