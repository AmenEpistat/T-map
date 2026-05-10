import { useEffect } from 'react';

export const useMapPopup = <T>(options: {
    paramName: string;
    onSelect: (id: string | null) => void;
    data: T | null;
    reset: () => void;
    idKey: keyof T;
    shareTitle: (data: T) => string;
    shareText: (data: T) => string;
}) => {
    const { paramName, onSelect, data, idKey, shareTitle, shareText, reset } =
        options;

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get(paramName);
        if (id) onSelect(id);
    }, []);

    const close = () => {
        onSelect(null);
        const url = new URL(window.location.href);
        reset();

        url.searchParams.delete(paramName);
        window.history.pushState({}, '', url);
    };

    const handleShare = async () => {
        const shareUrl = new URL(window.location.href);
        const id = data?.[idKey];

        if (id) {
            shareUrl.searchParams.set(paramName, String(id));
        }

        const shareData = {
            title: data ? shareTitle(data) : 'Ссылка',
            text: data ? shareText(data) : 'Посмотри на T-map',
            url: shareUrl.toString(),
        };
        await navigator.share(shareData);
    };

    return { close, handleShare };
};
