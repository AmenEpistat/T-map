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
const SEED_ADMIN_ID = '00000000-0000-0000-0000-0000000000ad';

const createSeedUsers = (): MockUser[] => [
    {
        userId: SEED_ADMIN_ID,
        email: 'admin@tmap.local',
        password: 'admin123',
        nickname: 'Admin',
        role: 'ADMIN',
    },
    {
        userId: SEED_OWNER_ID,
        email: 'owner@tmap.local',
        password: 'owner123',
        nickname: 'Owner',
        role: 'BUSINESS_OWNER',
    },
];

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
            dishOfDay: 'Авторский коктейль "Ивмиит отдыхает"',
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
        {
            id: '44444444-4444-4444-4444-444444444444',
            ownerId: SEED_OWNER_ID,
            name: 'Пекарня "Тёплый хлеб"',
            address: 'ул. Кремлёвская, 21, Казань',
            lat: 55.7975,
            lng: 49.1083,
            description: 'Свежая выпечка с раннего утра.',
            category: 'food',
            dishOfDay: 'Чёрный хлеб с тмином',
            h3Res9: '89115b22b13ffff',
            moderationStatus: 'PENDING',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: '55555555-5555-5555-5555-555555555555',
            ownerId: SEED_OWNER_ID,
            name: 'Караоке "Голос"',
            address: 'ул. Петербургская, 34, Казань',
            lat: 55.7841,
            lng: 49.1247,
            description: 'Караоке-бар с большим экраном и сценой.',
            category: 'entertainment',
            music: 'Pop, Rock, Эстрада',
            h3Res9: '89115b22b1bffff',
            moderationStatus: 'PENDING',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: '66666666-6666-6666-6666-666666666666',
            ownerId: SEED_OWNER_ID,
            name: 'Книжная лавка "Страница"',
            address: 'ул. Островского, 8, Казань',
            lat: 55.793,
            lng: 49.1155,
            description: 'Букинистический магазин с редкими изданиями.',
            category: 'shopping',
            h3Res9: '89115b22b23ffff',
            moderationStatus: 'PENDING_UPDATE',
            createdAt: now,
            updatedAt: now,
        },
    ];
};

const createEmptyDb = (): MockDb => ({
    users: createSeedUsers(),
    activeRefreshTokens: new Map(),
    currentRefreshToken: null,
    venues: createSeedVenues(),
});

export const mockDb: MockDb = window.__mockDb ?? createEmptyDb();
if (!window.__mockDb) {
    window.__mockDb = mockDb;
}
