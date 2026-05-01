import { useMemo } from 'react';
import { H3HexagonLayer } from '@deck.gl/geo-layers';
import {
    getBorderColor,
    getClusterColor,
    getNameColor,
} from '@/widgets/map-view/utils/colorUtils.ts';
import type { ClusterDataType } from '@/entities/map/model/types.ts';
import { mapStore } from '@/entities/map';
import iconsPng from '@/shared/assets/icons.png';
import iconsJson from '@/shared/assets/icons.json';
import { IconLayer, TextLayer } from '@deck.gl/layers';
import type { PublicVenue } from '@/entities/venue';

export const useMapLayers = () => {
    const clusters = mapStore.clusters.data?.clusters;
    const venues = mapStore.venues.data || [];

    const maxTx = useMemo(() => {
        if (!clusters || clusters.length === 0) return 0;
        return clusters.reduce((max, d) => Math.max(max, d.txCount), 0);
    }, [clusters]);

    const iconMapping = iconsJson.frames.reduce(
        (acc, value) => {
            const cleanKey = value.filename.replace('.svg', '');
            acc[cleanKey] = {
                x: value.frame.x,
                y: value.frame.y,
                width: value.frame.w,
                height: value.frame.h,
                anchorY: value.frame.h,
                anchorX: value.frame,
            };

            return acc;
        },
        {} as Record<string, any>
    );

    const layers = useMemo(
        () => [
            new H3HexagonLayer<ClusterDataType>({
                id: 'h3-hexagon-layer',
                data: clusters,
                getHexagon: (d) => d.h3Index,
                elevationScale: 0,
                stroked: true,
                extruded: false,
                getLineWidth: 3,
                coverage: 0.955,
                getLineColor: (d) => getBorderColor(d.txCount, maxTx),
                getFillColor: (d) => getClusterColor(d.txCount, maxTx),
                pickable: true,
                autoHighlight: true,
                highlightColor: [255, 255, 255, 100],
                updateTriggers: {
                    getFillColor: [maxTx],
                    getLineColor: [maxTx],
                },
                onClick: ({ object }) => {
                    if (!object) return;
                    mapStore.setClusterIndex(object.h3Index);
                },
            }),
            new IconLayer<PublicVenue>({
                id: 'poi-icons',
                data: venues,
                iconAtlas: iconsPng,
                iconMapping: iconMapping,
                getIcon: (d) => d.category,
                getSize: 40,
                getPosition: (d) => [d.lng, d.lat],
                pickable: true,
            }),
            new TextLayer<PublicVenue>({
                id: 'poi-labels',
                data: venues,
                getPosition: (d) => [d.lng, d.lat],
                getText: (d) => d.name,
                getSize: 14,
                getColor: (d: PublicVenue) => getNameColor(d.category),
                fontFamily: 'Inter, sans-serif',
                fontWeight: 'bold',
                getPixelOffset: [10, -50],
            }),
        ],
        [clusters, venues, maxTx]
    );

    return layers;
};
