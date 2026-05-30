import { useCallback, useEffect, useRef } from 'react';
import { mapStore } from '@/entities/map';
import type { ViewStateChangeEvent } from 'react-map-gl/mapbox-legacy';

export const useMapControl = () => {
    const mapRef = useRef<any>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateBounds = useCallback(() => {
        if (!mapRef.current) return;
        const map = mapRef.current.getMap();
        const bounds = map.getBounds();

        if (bounds) {
            mapStore.setBounds({
                swLat: bounds.getSouthWest().lat,
                swLng: bounds.getSouthWest().lng,
                neLat: bounds.getNorthEast().lat,
                neLng: bounds.getNorthEast().lng,
            });
        }
    }, []);

    const handleViewStateChange = useCallback(
        (e: ViewStateChangeEvent) => {
            mapStore.setViewState(e.viewState);

            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(updateBounds, 500);
        },
        [updateBounds]
    );

    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    const handleMapLoad = useCallback(() => {
        updateBounds();
    }, [updateBounds]);

    return {
        mapRef,
        handleViewStateChange,
        handleMapLoad,
    };
};
