import type { Color } from '@deck.gl/core';

export const getClusterColor = (
    txCount: number,
    maxTx: number = 500
): Color => {
    const a = Math.min(Math.max(txCount / maxTx, 0), 1);

    const baseRGB = [76, 38, 246];

    const opacity = Math.round(30 + a * (150 - 40));

    return [...baseRGB, opacity] as unknown as Color;
};

export const getBorderColor = (txCount: number, maxTx: number): Color => {
    const baseColor = getClusterColor(txCount, maxTx);

    return [
        Math.round(baseColor[0] * 0.9),
        Math.round(baseColor[1] * 0.9),
        Math.round(baseColor[2] * 0.9),
        255,
    ] as Color;
};
