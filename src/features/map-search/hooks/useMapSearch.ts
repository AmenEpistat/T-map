import { useState, useEffect } from 'react';
import type { Venue } from '@/entities/venue/model/types.ts';
import { publicVenueStore, type VenueSearch } from '@/entities/public-venue';
import { ANIMATION_DURATION, mapStore } from '@/entities/map';
import { FlyToInterpolator } from '@deck.gl/core';

export const useMapSearch = (onClose: () => void) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<VenueSearch[]>([]);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            await publicVenueStore.loadVenueBySearch(query);
            const data = publicVenueStore.venueSearch.data;

            setSuggestions(data || []);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    const handleSelect = (venue: Venue) => {
        mapStore.setClusterIndex(null);
        mapStore.clusterDetail.reset();

        publicVenueStore.setSelectedVenueIndex(venue.id);
        handleClear();
        onClose();

        mapStore.setViewState({
            ...mapStore.viewState,
            longitude: venue.lng,
            latitude: venue.lat,
            zoom: 17,
            transitionDuration: ANIMATION_DURATION,
            transitionInterpolator: new FlyToInterpolator(),
        });
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
    };

    return {
        query,
        suggestions,
        handleChange: setQuery,
        handleSelect,
        handleClear,
        isLoading: publicVenueStore.venueSearch.isLoading,
    };
};
