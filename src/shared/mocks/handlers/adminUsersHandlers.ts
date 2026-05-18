import { http, HttpResponse, delay } from 'msw';
import type { HttpHandler } from 'msw';
import type {
    AdminUserModeration,
    AdminUserModerationPage,
    ErrorResponse,
    UserRole,
} from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { mockDb, type MockUser } from '../db';
import { err, requireAdminAuth } from './utils';

const BASE = env.API_BASE_URL;
const LATENCY_MS = 300;

type IdParam = { id: string };
type ListResponse = AdminUserModerationPage | ErrorResponse;
type ItemResponse = AdminUserModeration | ErrorResponse;

const toAdminUser = (user: MockUser): AdminUserModeration => ({
    id: user.userId,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    blocked: user.blocked,
    createdAt: user.createdAt,
});

const paginate = (
    items: AdminUserModeration[],
    page: number,
    size: number
): AdminUserModerationPage => {
    const start = page * size;

    return {
        items: items.slice(start, start + size),
        page,
        size,
        totalElements: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / size)),
    };
};

const parsePage = (value: string | null): number => {
    const parsed = value ? Number(value) : 0;

    if (Number.isNaN(parsed)) return 0;

    return Math.max(0, parsed);
};

const parseSize = (value: string | null): number => {
    const parsed = value ? Number(value) : 20;

    if (Number.isNaN(parsed)) return 20;

    return Math.min(100, Math.max(1, parsed));
};

const parseBoolean = (value: string | null): boolean | null => {
    if (value === 'true') return true;
    if (value === 'false') return false;

    return null;
};

const isRole = (value: string | null): value is UserRole =>
    value === 'USER' || value === 'BUSINESS_OWNER' || value === 'ADMIN';

const matchesTextSearch = (
    user: AdminUserModeration,
    email: string | null,
    nickname: string | null
): boolean => {
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedNickname = nickname?.trim().toLowerCase();

    if (!normalizedEmail && !normalizedNickname) return true;

    const matchesEmail = Boolean(
        normalizedEmail && user.email.toLowerCase().includes(normalizedEmail)
    );

    const matchesNickname = Boolean(
        normalizedNickname &&
        user.nickname.toLowerCase().includes(normalizedNickname)
    );

    return matchesEmail || matchesNickname;
};

const matchesCreatedRange = (
    user: AdminUserModeration,
    createdFrom: string | null,
    createdTo: string | null
): boolean => {
    const createdAt = new Date(user.createdAt).getTime();

    if (Number.isNaN(createdAt)) return false;

    if (createdFrom) {
        const from = new Date(createdFrom).getTime();

        if (!Number.isNaN(from) && createdAt < from) {
            return false;
        }
    }

    if (createdTo) {
        const to = new Date(createdTo).getTime();

        if (!Number.isNaN(to) && createdAt > to) {
            return false;
        }
    }

    return true;
};

const isProtectedUser = (target: MockUser, currentAdminId: string): boolean =>
    target.userId === currentAdminId || target.role === 'ADMIN';

const searchUsers = http.get<never, never, ListResponse>(
    `${BASE}/admin/users/search`,
    async ({ request }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const url = new URL(request.url);

        const email = url.searchParams.get('email');
        const nickname = url.searchParams.get('nickname');
        const role = url.searchParams.get('role');
        const blocked = parseBoolean(url.searchParams.get('blocked'));
        const createdFrom = url.searchParams.get('createdFrom');
        const createdTo = url.searchParams.get('createdTo');
        const page = parsePage(url.searchParams.get('page'));
        const size = parseSize(url.searchParams.get('size'));

        let users = mockDb.users.map(toAdminUser);

        users = users.filter((user) =>
            matchesTextSearch(user, email, nickname)
        );

        if (isRole(role)) {
            users = users.filter((user) => user.role === role);
        }

        if (blocked !== null) {
            users = users.filter((user) => user.blocked === blocked);
        }

        users = users.filter((user) =>
            matchesCreatedRange(user, createdFrom, createdTo)
        );

        users.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

        return HttpResponse.json<AdminUserModerationPage>(
            paginate(users, page, size),
            { status: 200 }
        );
    }
);

const blockUser = http.patch<IdParam, never, ItemResponse>(
    `${BASE}/admin/users/:id/block`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const index = mockDb.users.findIndex(
            (user) => user.userId === params.id
        );

        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested user with ID ${params.id} was not found.`,
                404
            );
        }

        const existing = mockDb.users[index];

        if (isProtectedUser(existing, auth.user.userId)) {
            return err(
                'FORBIDDEN',
                'Admin users cannot be blocked from admin panel.',
                403
            );
        }

        if (existing.blocked) {
            return err(
                'CONFLICT',
                `User with ID ${params.id} is already blocked.`,
                409
            );
        }

        const updated: MockUser = {
            ...existing,
            blocked: true,
        };

        mockDb.users[index] = updated;

        return HttpResponse.json<AdminUserModeration>(toAdminUser(updated), {
            status: 200,
        });
    }
);

const unblockUser = http.patch<IdParam, never, ItemResponse>(
    `${BASE}/admin/users/:id/unblock`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const index = mockDb.users.findIndex(
            (user) => user.userId === params.id
        );

        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested user with ID ${params.id} was not found.`,
                404
            );
        }

        const existing = mockDb.users[index];

        if (isProtectedUser(existing, auth.user.userId)) {
            return err(
                'FORBIDDEN',
                'Admin users cannot be unblocked from admin panel.',
                403
            );
        }

        if (!existing.blocked) {
            return err(
                'CONFLICT',
                `User with ID ${params.id} is not blocked.`,
                409
            );
        }

        const updated: MockUser = {
            ...existing,
            blocked: false,
        };

        mockDb.users[index] = updated;

        return HttpResponse.json<AdminUserModeration>(toAdminUser(updated), {
            status: 200,
        });
    }
);

export const adminUsersHandlers: HttpHandler[] = [
    searchUsers,
    blockUser,
    unblockUser,
];
