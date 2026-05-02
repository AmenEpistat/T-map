import { apiClient } from '@/shared/api';
import {
    type Bounds,
    type ClusterDataType,
    type ClusterDetail,
    type MapCategory,
    RESOLUTION,
} from '@/entities/map';

export const heatmapApi = {
    getClusters: async (bounds: Bounds) => {
        return await apiClient.get<{ clusters: ClusterDataType[] }>(
            '/heatmap/clusters',
            {
                params: {
                    ...bounds,
                    resolution: RESOLUTION,
                },
            }
        );
    },

    getClusterByIndex: async (h3Index: string) => {
        return await apiClient.get<ClusterDetail>(
            `/heatmap/clusters/${h3Index}`,
            {
                params: {
                    resolution: RESOLUTION,
                },
            }
        );
    },

    getVenues: async (bounds: Bounds, categories: MapCategory[]) => {
        return await apiClient.get('/venues', {
            params: {
                ...bounds,
                category: categories,
            },
        });
    },
};
