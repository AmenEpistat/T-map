import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publicVenueStore } from './publicVenueStore';
import { publicVenueApi } from '@/entities/public-venue';

vi.mock('@/entities/public-venue', () => ({
    publicVenueApi: {
        getVenueById: vi.fn(),
        getVenueBySearch: vi.fn(),
        getVenueQrCode: vi.fn(),
    },
}));

describe('PublicVenueStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        publicVenueStore.setSelectedVenueIndex(null);
    });

    describe('setSelectedVenueIndex', () => {
        it('устанавливает id', () => {
            publicVenueStore.setSelectedVenueIndex('123');
            expect(publicVenueStore.selectedVenueIndex).toBe('123');
        });

        it('сбрасывает в null', () => {
            publicVenueStore.setSelectedVenueIndex('123');
            publicVenueStore.setSelectedVenueIndex(null);
            expect(publicVenueStore.selectedVenueIndex).toBeNull();
        });
    });

    describe('isVenueSelected', () => {
        it('false если нет выбранного', () => {
            expect(publicVenueStore.isVenueSelected).toBe(false);
        });

        it('true если есть выбранный', () => {
            publicVenueStore.setSelectedVenueIndex('123');
            expect(publicVenueStore.isVenueSelected).toBe(true);
        });
    });

    describe('loadVenueDetails', () => {
        it('не делает запрос без selectedVenueIndex', async () => {
            await publicVenueStore.loadVenueDetails();
            expect(publicVenueApi.getVenueById).not.toHaveBeenCalled();
        });

        it('делает запрос с правильным id', async () => {
            vi.mocked(publicVenueApi.getVenueById).mockResolvedValue({
                data: { id: '123' },
            } as any);

            publicVenueStore.setSelectedVenueIndex('123');
            await publicVenueStore.loadVenueDetails();
            expect(publicVenueApi.getVenueById).toHaveBeenCalledWith('123');
        });
    });

    describe('loadVenueBySearch', () => {
        it('делает запрос со строкой поиска', async () => {
            vi.mocked(publicVenueApi.getVenueBySearch).mockResolvedValue({
                data: [],
            } as any);

            await publicVenueStore.loadVenueBySearch('pizza');
            expect(publicVenueApi.getVenueBySearch).toHaveBeenCalledWith(
                'pizza'
            );
        });
    });

    describe('loadVenueQrCode', () => {
        it('не делает запрос без selectedVenueIndex', async () => {
            await publicVenueStore.loadVenueQrCode('rule1');
            expect(publicVenueApi.getVenueQrCode).not.toHaveBeenCalled();
        });

        it('делает запрос с venueId и ruleId', async () => {
            vi.mocked(publicVenueApi.getVenueQrCode).mockResolvedValue({
                data: {},
            } as any);

            publicVenueStore.setSelectedVenueIndex('venue1');
            await publicVenueStore.loadVenueQrCode('rule1');
            expect(publicVenueApi.getVenueQrCode).toHaveBeenCalledWith(
                'venue1',
                'rule1'
            );
        });
    });
});
