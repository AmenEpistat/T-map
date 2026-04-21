import type { UserRole } from '@/shared/api/types';

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
}

declare global {
    interface Window {
        __mockDb?: MockDb;
    }
}

const createEmptyDb = (): MockDb => ({
    users: [],
    activeRefreshTokens: new Map(),
    currentRefreshToken: null,
});

export const mockDb: MockDb = window.__mockDb ?? createEmptyDb();

if (!window.__mockDb) {
    window.__mockDb = mockDb;
}
