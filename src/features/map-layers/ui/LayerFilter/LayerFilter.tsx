import {
    LayerFilterDesktop,
    LayerFilterMobile,
} from '@/features/map-layers/ui/LayerFilter/components';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';

const LayerFilter = () => {
    const isMobile = useIsMobile();

    return isMobile ? <LayerFilterMobile /> : <LayerFilterDesktop />;
};

export default LayerFilter;
