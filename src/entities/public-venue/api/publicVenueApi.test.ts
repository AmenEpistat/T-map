import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publicVenueApi } from './publicVenueApi';
import { apiClient } from '@/shared/api';

vi.mock('@/shared/api', () => ({
    apiClient: { get: vi.fn() },
}));

describe('publicVenueApi', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getVenueById', () => {
        it('вызывает правильный эндпоинт', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({});
            await publicVenueApi.getVenueById('123');
            expect(apiClient.get).toHaveBeenCalledWith('/venues/123');
        });

        it('возвращает данные', async () => {
            const mock = { id: '123', name: 'Cafe' };
            vi.mocked(apiClient.get).mockResolvedValue(mock);
            const result = await publicVenueApi.getVenueById('123');
            expect(result).toEqual(mock);
        });
    });

    describe('getVenueBySearch', () => {
        it('передаёт поисковый запрос', async () => {
            vi.mocked(apiClient.get).mockResolvedValue([]);
            await publicVenueApi.getVenueBySearch('pizza');
            expect(apiClient.get).toHaveBeenCalledWith('/venues/search', {
                params: { q: 'pizza' },
            });
        });

        it('передаёт пустую строку', async () => {
            vi.mocked(apiClient.get).mockResolvedValue([]);
            await publicVenueApi.getVenueBySearch('');
            expect(apiClient.get).toHaveBeenCalledWith('/venues/search', {
                params: { q: '' },
            });
        });
    });

    describe('getVenueQrCode', () => {
        it('вызывает правильный эндпоинт с обоими id', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({});
            await publicVenueApi.getVenueQrCode('venue1', 'rule1');
            expect(apiClient.get).toHaveBeenCalledWith(
                '/venues/venue1/loyalty-rules/rule1/qr',
                { params: { id: 'venue1', ruleId: 'rule1' } }
            );
        });
    });
});
