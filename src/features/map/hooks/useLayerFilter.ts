import { mapStore } from '@/features/map/model/mapStore';
import type { MapCategory } from '@/entities/map';

export const useLayerFilter = () => {
    const toggleCategory = (key: MapCategory) => {
        mapStore.toggleCategory(key);
    };

    const toggleAnomalies = () => {
        mapStore.toggleAnomalies();
    };

    const isSelected = (key: MapCategory) =>
        mapStore.selectedCategories.includes(key);

    const isAnomaliesVisible = mapStore.isAnomaliesVisible;

    return {
        toggleCategory,
        isSelected,
        toggleAnomalies,
        isAnomaliesVisible,
    };
};
