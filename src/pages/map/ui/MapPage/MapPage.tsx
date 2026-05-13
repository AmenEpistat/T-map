import { RotateControl, ZoomControls } from '@/features/map-controls';
import { LayerFilter } from '@/features/map-layers';
import { ClusterPopup } from '@/features/map-cluster-popup';
import { TeamPopup } from '@/features/map-team-popup';
import { lazy, Suspense } from 'react';
import { Splash } from '@/shared/ui';
import { VenuePopup } from '@/features/map-venue-popup';
import { MapPanel } from '@/widgets/map-panel';

const MapView = lazy(() =>
    import('@/widgets/map-view').then((module) => ({ default: module.MapView }))
);

export const MapPage = () => {
    return (
        <section>
            <MapPanel />
            <ZoomControls />
            <RotateControl />
            <LayerFilter />
            <ClusterPopup />
            <VenuePopup />
            <TeamPopup />
            <Suspense fallback={<Splash />}>
                <MapView />
            </Suspense>
        </section>
    );
};
