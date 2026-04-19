import { MapView } from '@/features/map';
import ZoomControls from '@/features/map/components/ZoomControls/ZoomControls.tsx';

export const MapPage = () => {
    return (
        <section>
            <MapView />
            <ZoomControls />
        </section>
    );
};
