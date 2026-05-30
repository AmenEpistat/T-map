import { gridDisk, latLngToCell } from 'h3-js';

const center = latLngToCell(55.7961, 49.1064, 9);
export const neighbors = gridDisk(center, 40);

export const defaultClusters = neighbors.map((h3Index) => ({
    h3Index,
}));
