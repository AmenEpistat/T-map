import { useMemo } from 'react';
import { H3HexagonLayer } from '@deck.gl/geo-layers';
import {
    getBorderColor,
    getClusterColor,
} from '@/features/map/utils/colorUtils.ts';
import type { ClusterDataType } from '@/features/map/model/types.ts';

export const useMapLayers = (data: ClusterDataType[]) => {
    const maxTx = useMemo(() => {
        if (!data || data.length === 0) return 0;
        return data.reduce((max, d) => Math.max(max, d.txCount), 0);
    }, [data]);

    const layers = useMemo(
        () => [
            new H3HexagonLayer<ClusterDataType>({
                id: 'h3-hexagon-layer',
                data,
                getHexagon: (d) => d.h3Index,
                elevationScale: 0,
                stroked: true,
                extruded: false,
                getLineWidth: 2,
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
            }),
        ],
        [data, maxTx]
    );

    return layers;
};
