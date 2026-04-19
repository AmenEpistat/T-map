import type { UserRole } from '@/shared/api/types';

export interface MockUser {
    userId: string;
    email: string;
    password: string; // mocks only
    nickname: string;
    role: UserRole;
}

interface MockDb {
    users: MockUser[];
    activeRefreshTokens: Set<string>;
}

export const mockDb: MockDb = {
    users: [],
    activeRefreshTokens: new Set(),
};
