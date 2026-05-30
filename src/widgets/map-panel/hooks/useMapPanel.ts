import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useMapPanel = () => {
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has('venue') || searchParams.has('cluster')) {
            setSearchOpen(false);
        }
    }, [searchParams]);

    const handleOpenProfile = () => {
        const newParams = new URLSearchParams();
        newParams.set('profile', '');
        setSearchParams(newParams);
    };

    const handleCloseProfile = () => {
        searchParams.delete('profile');
        setSearchParams(searchParams);
    };

    const isPanelOpen = useMemo(() => {
        return searchParams.has('profile');
    }, [searchParams]);

    return {
        setSearchOpen,
        isSearchOpen,
        isPanelOpen,
        handleCloseProfile,
        handleOpenProfile,
    };
};
