import { useState, useEffect } from 'react';
import { TABLET_WIDTH } from '@/shared/model/constants.ts';

export const useIsMobile = () => {
    const [isMobile, setMobile] = useState(window.innerWidth < TABLET_WIDTH);

    useEffect(() => {
        const handler = () => setMobile(window.innerWidth < TABLET_WIDTH);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return isMobile;
};
