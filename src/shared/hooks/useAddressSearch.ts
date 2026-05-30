import { useEffect, useState } from 'react';
import {
    searchAddresses,
    type AddressSuggestion,
} from '@/shared/api/nominatimApi';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 4;

interface UseAddressSearchResult {
    suggestions: AddressSuggestion[];
    isLoading: boolean;
    error: string | null;
}

export const useAddressSearch = (query: string): UseAddressSearchResult => {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const trimmed = query.trim();

        if (trimmed.length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        let isCancelled = false;
        setIsLoading(true);
        setError(null);

        const timer = setTimeout(() => {
            searchAddresses(trimmed)
                .then((results) => {
                    if (isCancelled) return;
                    setSuggestions(results);
                })
                .catch((err: unknown) => {
                    if (isCancelled) return;
                    const message =
                        err instanceof Error
                            ? err.message
                            : 'Ошибка поиска адреса';
                    setError(message);
                })
                .finally(() => {
                    if (isCancelled) return;
                    setIsLoading(false);
                });
        }, DEBOUNCE_MS);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [query]);

    return { suggestions, isLoading, error };
};
