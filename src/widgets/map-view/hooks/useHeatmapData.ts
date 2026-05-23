import { useEffect } from 'react';
import { reaction } from 'mobx';
import { mapStore } from '@/entities/map';
import { ZOOM_ICON } from '@/widgets/map-view/model/constants.ts';

export const useHeatmapData = () => {
    useEffect(() => {
        const disposeCluster = reaction(
            () => ({
                bounds: mapStore.bounds,
            }),
            async () => {
                const zoom = mapStore.viewState.zoom;
                if (zoom < ZOOM_ICON) {
                    await mapStore.loadClusters();
                }
            },
            {
                delay: 500,
            }
        );

        const disposeVenue = reaction(
            () => ({
                bounds: mapStore.bounds,
                categories: mapStore.selectedCategories.slice(),
            }),
            async () => {
                const zoom = mapStore.viewState.zoom;
                if (zoom >= ZOOM_ICON) {
                    await mapStore.loadVenues();
                }
            },
            {
                delay: 500,
            }
        );

        return () => {
            disposeCluster();
            disposeVenue();
        };
    }, []);
};
