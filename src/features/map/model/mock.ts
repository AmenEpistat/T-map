import { gridDisk, latLngToCell } from 'h3-js';

const center = latLngToCell(55.7961, 49.1064, 9);
const neighbors = gridDisk(center, 3);

export const mockClusters = neighbors.map((h3Index) => ({
    h3Index,
    txCount: Math.floor(Math.random() * 3000),
    avgCheck: 500 + Math.random() * 2000,
}));
