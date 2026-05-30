import { HttpResponse } from 'msw';
import type { ErrorResponse } from '@/shared/api/types';
import { mockDb, type MockUser } from '../db';

export const err = (code: string, message: string, status: number) =>
    HttpResponse.json<ErrorResponse>({ code, message }, { status });

export const getUserFromToken = (request: Request): MockUser | null => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.slice('Bearer '.length);

    if (token.startsWith('expired.')) return null;

    const parts = token.split('.');
    if (parts.length < 4 || parts[0] !== 'mock' || parts[1] !== 'access') {
        return null;
    }

    const userId = parts[2];
    return mockDb.users.find((u) => u.userId === userId) ?? null;
};

export type AdminAuthResult =
    | { user: MockUser; error: null }
    | { user: null; error: ReturnType<typeof err> };

export const requireAdminAuth = (request: Request): AdminAuthResult => {
    const user = getUserFromToken(request);

    if (!user) {
        return {
            user: null,
            error: err(
                'UNAUTHORIZED',
                'Access token is missing or invalid.',
                401
            ),
        };
    }

    if (user.role !== 'ADMIN') {
        return {
            user: null,
            error: err(
                'FORBIDDEN',
                'Admin role is required for this resource.',
                403
            ),
        };
    }

    return { user, error: null };
};
