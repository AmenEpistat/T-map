import { MapView } from '@/features/map';
import ZoomControls from '@/features/map/components/ZoomControls/ZoomControls.tsx';
import MapSearch from '@/features/map/components/MapSearch/MapSearch.tsx';

export const MapPage = () => {
    return (
        <section>
            <MapSearch />
            <MapView />
            <ZoomControls />
        </section>
    );
};
