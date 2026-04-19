import type { Color } from '@deck.gl/core';

export const getClusterColor = (
    txCount: number,
    maxTx: number = 500
): Color => {
    const a = Math.min(Math.max(txCount / maxTx, 0), 1);

    const r = Math.round(Math.min(a * 2, 1) * 255);
    const g = Math.round(Math.min((1 - a) * 2, 1) * 255);

    return [r, g, 0, 100] as Color;
};

export const getBorderColor = (txCount: number, maxTx: number): Color => {
    const baseColor = getClusterColor(txCount, maxTx);

    return [
        Math.round(baseColor[0] * 0.7),
        Math.round(baseColor[1] * 0.7),
        Math.round(baseColor[2] * 0.7),
        255,
    ] as Color;
};
