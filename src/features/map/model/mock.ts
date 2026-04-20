import { gridDisk, latLngToCell } from 'h3-js';
import type { Venue } from '@/entities/venue/model/types.ts';

const center = latLngToCell(55.7961, 49.1064, 9);
const neighbors = gridDisk(center, 3);

export const mockClusters = neighbors.map((h3Index) => ({
    h3Index,
    txCount: Math.floor(Math.random() * 3000),
    avgCheck: 500 + Math.random() * 2000,
}));

export const mockVenues: Venue[] = [
    {
        id: '5085d345-3129-4e4b-972d-8bcf9a2ea9c9',
        name: 'Скуратов Кофе',
        address: 'ул. Баумана, 9, Казань',
        lat: 55.7915,
        lng: 49.1118,
    },
    {
        id: '5085d345',
        name: 'ИВМиИТ лучше итис',
        address: 'Кремлевская',
        lat: 55.7915,
        lng: 49.1118,
    },
];
