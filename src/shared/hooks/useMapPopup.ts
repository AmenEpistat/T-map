import { useEffect } from 'react';

export const useMapPopup = <T>(options: {
    paramName: string;
    onSelect: (id: string | null) => void;
    data: T | null;
    reset: () => void;
    shareTitle: (data: T) => string;
    shareText: (data: T) => string;
}) => {
    const { paramName, onSelect, data, shareTitle, shareText, reset } = options;

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get(paramName);
        if (id) onSelect(id);
    }, []);

    const open = (id: string) => {
        onSelect(id);

        const url = new URL(window.location.href);
        url.searchParams.set(paramName, id);

        window.history.pushState({}, '', url.toString());
    };

    const close = () => {
        onSelect(null);
        const url = new URL(window.location.href);
        reset();

        url.searchParams.delete(paramName);
        window.history.pushState({}, '', url);
    };

    const handleShare = async () => {
        if (!data) return;
        await navigator.share({
            title: shareTitle(data),
            text: shareText(data),
            url: window.location.href,
        });
    };

    return { open, close, handleShare };
};
