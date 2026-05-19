import type { UserRole, VenueOwnerResponse } from '@/shared/api/types';

export interface MockUser {
    userId: string;
    email: string;
    password: string;
    nickname: string;
    role: UserRole;
    blocked: boolean;
    createdAt: string;
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
        blocked: false,
        createdAt: '2025-02-12T09:00:00.000Z',
    },
    {
        userId: SEED_OWNER_ID,
        email: 'owner@tmap.local',
        password: 'owner123',
        nickname: 'Owner',
        role: 'BUSINESS_OWNER',
        blocked: false,
        createdAt: '2026-04-13T09:00:00.000Z',
    },
    {
        userId: '7f3a1c92-4b6e-4d2a-9f11-2d9a8f1b3c01',
        email: 'user1@tmap.local',
        password: 'user123',
        nickname: 'Alex',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-01T09:00:00.000Z',
    },
    {
        userId: 'c1d8e5b4-9f22-41d3-b7e3-5f3c7a9d1202',
        email: 'user2@tmap.local',
        password: 'user123',
        nickname: 'Mia',
        role: 'USER',
        blocked: true,
        createdAt: '2026-04-02T09:00:00.000Z',
    },
    {
        userId: 'a9b7c6d5-e4f3-4821-91aa-7b8c9d0e3303',
        email: 'owner2@tmap.local',
        password: 'owner123',
        nickname: 'CafeOwner',
        role: 'BUSINESS_OWNER',
        blocked: false,
        createdAt: '2026-04-03T09:00:00.000Z',
    },
    {
        userId: '2c4e6f88-1a2b-4c3d-9e7f-8a9b0c1d4404',
        email: 'user3@tmap.local',
        password: 'user123',
        nickname: 'Liam',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-04T09:00:00.000Z',
    },
    {
        userId: '5d7f9a11-b2c3-4d5e-8f90-1a2b3c4d5505',
        email: 'owner3@tmap.local',
        password: 'owner123',
        nickname: 'ShopBoss',
        role: 'BUSINESS_OWNER',
        blocked: true,
        createdAt: '2026-04-05T09:00:00.000Z',
    },
    {
        userId: '8e1f2a33-c4d5-46e7-9f01-2b3c4d5e6606',
        email: 'user4@tmap.local',
        password: 'user123',
        nickname: 'Sophia',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-06T09:00:00.000Z',
    },
    {
        userId: '9a0b1c44-d5e6-47f8-a102-3c4d5e6f7707',
        email: 'user5@tmap.local',
        password: 'user123',
        nickname: 'Daniel',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-07T09:00:00.000Z',
    },
    {
        userId: '1b2c3d55-e6f7-4899-b203-4d5e6f887808',
        email: 'owner4@tmap.local',
        password: 'owner123',
        nickname: 'MarketKing',
        role: 'BUSINESS_OWNER',
        blocked: false,
        createdAt: '2026-04-08T09:00:00.000Z',
    },
    {
        userId: '3c4d5e66-f7a8-4aaa-c304-5e6f77889909',
        email: 'user6@tmap.local',
        password: 'user123',
        nickname: 'Emma',
        role: 'USER',
        blocked: true,
        createdAt: '2026-04-09T09:00:00.000Z',
    },
    {
        userId: '4d5e6f77-a8b9-4bbb-d405-6f778899aa10',
        email: 'user7@tmap.local',
        password: 'user123',
        nickname: 'Noah',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-10T09:00:00.000Z',
    },
    {
        userId: '5e6f7788-b9c0-4ccc-e506-778899aabb11',
        email: 'user8@tmap.local',
        password: 'user123',
        nickname: 'Olivia',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-11T09:00:00.000Z',
    },
    {
        userId: '6f778899-c0d1-4ddd-f607-8899aabbcc12',
        email: 'owner5@tmap.local',
        password: 'owner123',
        nickname: 'BakeryPro',
        role: 'BUSINESS_OWNER',
        blocked: false,
        createdAt: '2026-04-12T09:00:00.000Z',
    },
    {
        userId: '778899aa-d1e2-4eee-a708-99aabbccdd13',
        email: 'user9@tmap.local',
        password: 'user123',
        nickname: 'James',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-13T09:00:00.000Z',
    },
    {
        userId: '8899aabb-e2f3-4fff-b809-aabbccddee14',
        email: 'user10@tmap.local',
        password: 'user123',
        nickname: 'Charlotte',
        role: 'USER',
        blocked: true,
        createdAt: '2026-04-14T09:00:00.000Z',
    },
    {
        userId: '99aabbcc-f304-4000-c90a-bbccddeeff15',
        email: 'user11@tmap.local',
        password: 'user123',
        nickname: 'Benjamin',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-15T09:00:00.000Z',
    },
    {
        userId: 'aabbccdd-0415-4111-d10b-ccddeeff0016',
        email: 'owner6@tmap.local',
        password: 'owner123',
        nickname: 'FoodMaster',
        role: 'BUSINESS_OWNER',
        blocked: false,
        createdAt: '2026-04-16T09:00:00.000Z',
    },
    {
        userId: 'bbccddee-1526-4222-e20c-ddeeff001117',
        email: 'user12@tmap.local',
        password: 'user123',
        nickname: 'Amelia',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-17T09:00:00.000Z',
    },
    {
        userId: 'ccddeeff-2637-4333-f30d-eeff00112218',
        email: 'user13@tmap.local',
        password: 'user123',
        nickname: 'Lucas',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-18T09:00:00.000Z',
    },
    {
        userId: 'ddeeff00-3748-4444-a40e-ff0011223319',
        email: 'user14@tmap.local',
        password: 'user123',
        nickname: 'Harper',
        role: 'USER',
        blocked: true,
        createdAt: '2026-04-19T09:00:00.000Z',
    },
    {
        userId: 'eeff0011-4859-4555-b50f-001122334420',
        email: 'owner7@tmap.local',
        password: 'owner123',
        nickname: 'TechStore',
        role: 'BUSINESS_OWNER',
        blocked: false,
        createdAt: '2026-04-20T09:00:00.000Z',
    },
    {
        userId: 'ff001122-596a-4666-c610-112233445521',
        email: 'user15@tmap.local',
        password: 'user123',
        nickname: 'Evelyn',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-21T09:00:00.000Z',
    },
    {
        userId: '00112233-6a7b-4777-d711-223344556622',
        email: 'user16@tmap.local',
        password: 'user123',
        nickname: 'Henry',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-22T09:00:00.000Z',
    },
    {
        userId: '11223344-7b8c-4888-e812-334455667723',
        email: 'user17@tmap.local',
        password: 'user123',
        nickname: 'Grace',
        role: 'USER',
        blocked: false,
        createdAt: '2026-04-23T09:00:00.000Z',
    },
    {
        userId: '22334455-8c9d-4999-f913-445566778824',
        email: 'owner8@tmap.local',
        password: 'owner123',
        nickname: 'AutoDealer',
        role: 'BUSINESS_OWNER',
        blocked: true,
        createdAt: '2026-04-24T09:00:00.000Z',
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
