import type { UserRole, VenueOwnerResponse } from '@/shared/api/types';

export interface MockUser {
    userId: string;
    email: string;
    password: string;
    nickname: string;
    role: UserRole;
}

interface MockDb {
    users: MockUser[];
    activeRefreshTokens: Map<string, string>;
    currentRefreshToken: string | null;
    venues: VenueOwnerResponse[];
}

declare global {
    interface Window {
        __mockDb?: MockDb;
    }
}

const SEED_OWNER_ID = '00000000-0000-0000-0000-000000000001';

const createSeedVenues = (): VenueOwnerResponse[] => {
    const now = new Date().toISOString();
    return [
        {
            id: '11111111-1111-1111-1111-111111111111',
            ownerId: SEED_OWNER_ID,
            name: 'Скуратов Кофе',
            address: 'ул. Баумана, 9, Казань',
            lat: 55.7915,
            lng: 49.1118,
            description: 'Лучший кофе в центре Казани. Зерно свежей обжарки.',
            category: 'food',
            photoUrl: 'https://placehold.co/600x400?text=Skuratov',
            dishOfDay: 'Нитро кофе + Круассан',
            music: 'Indie Pop, Lo-Fi',
            h3Res9: '89115b22b0bffff',
            moderationStatus: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            ownerId: SEED_OWNER_ID,
            name: 'Бар "Сияние"',
            address: 'ул. Профсоюзная, 12, Казань',
            lat: 55.7902,
            lng: 49.1186,
            description: 'Уютный бар с авторскими коктейлями.',
            category: 'entertainment',
            photoUrl: 'https://placehold.co/600x400?text=Siyanie',
            h3Res9: '89115b22b07ffff',
            moderationStatus: 'PENDING',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            ownerId: SEED_OWNER_ID,
            name: 'Магазин "Спам"',
            address: 'ул. Несуществующая, 999',
            lat: 55.78,
            lng: 49.1,
            category: 'shopping',
            h3Res9: '89115b22b03ffff',
            moderationStatus: 'REJECTED',
            rejectReason: 'Адрес не совпадает с координатами',
            createdAt: now,
            updatedAt: now,
        },
    ];
};

const createEmptyDb = (): MockDb => ({
    users: [],
    activeRefreshTokens: new Map(),
    currentRefreshToken: null,
    venues: createSeedVenues(),
});

export const mockDb: MockDb = window.__mockDb ?? createEmptyDb();
if (!window.__mockDb) {
    window.__mockDb = mockDb;
}
