import { useState, useEffect } from 'react';
import type { Venue } from '@/entities/venue/model/types';
import { mockVenues } from '@/features/map/model/mock.ts';

export const useSearch = (onClose: () => void) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        let active = true;

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const filteredData = mockVenues.filter((venue) =>
                    venue.name.toLowerCase().includes(query.toLowerCase())
                );

                if (active) {
                    setSuggestions(filteredData);
                }
            } catch (error) {
                console.error('добавми компоненту для ошибок потом');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [query]);

    const handleSelect = (venue: Venue) => {
        console.log('тут будет логика честное слово');
        onClose();
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
    };

    return {
        query,
        suggestions,
        loading,
        handleChange: setQuery,
        handleSelect,
        handleClear,
    };
};
