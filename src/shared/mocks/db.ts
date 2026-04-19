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
    activeRefreshTokens: Map<string, string>; // token -> userId
    currentRefreshToken: string | null; // simulates httpOnly cookie
}

export const mockDb: MockDb = {
    users: [],
    activeRefreshTokens: new Map(),
    currentRefreshToken: null,
};
