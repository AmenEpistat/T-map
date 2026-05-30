import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get(paramName);
        onSelect(id);
    }, [searchParams, paramName]);

    const close = () => {
        reset();

        searchParams.delete(paramName);
        setSearchParams(searchParams);
    };

    const open = (id: string) => {
        searchParams.delete('profile');

        if (id) {
            searchParams.set(paramName, String(id));
        }

        setSearchParams(searchParams);
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

    return { close, handleShare, open };
};
