import { http, HttpResponse, delay } from 'msw';
import type { HttpHandler } from 'msw';
import type {
    AuthResponse,
    ErrorResponse,
    LoginRequest,
    RegisterRequest,
} from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { mockDb, type MockUser } from '../db';

const BASE = env.API_BASE_URL;

const LATENCY_MS = 300;

const generateId = () => crypto.randomUUID();
const generateAccessToken = (userId: string) =>
    `mock.access.${userId}.${Date.now()}`;
const generateRefreshToken = () => `mock.refresh.${crypto.randomUUID()}`;

const err = (code: string, message: string, status: number) =>
    HttpResponse.json<ErrorResponse>({ code, message }, { status });

const buildAuthResponse = (user: MockUser): AuthResponse => ({
    userId: user.userId,
    role: user.role,
    email: user.email,
    nickname: user.nickname,
    accessToken: generateAccessToken(user.userId),
});

const storeRefreshToken = (token: string, userId: string): void => {
    mockDb.activeRefreshTokens.set(token, userId);
    mockDb.currentRefreshToken = token;
};

const register = http.post<never, RegisterRequest>(
    `${BASE}/auth/register`,
    async ({ request }) => {
        await delay(LATENCY_MS);
        const body = await request.json();

        if (mockDb.users.some((u) => u.email === body.email)) {
            return err(
                'CONFLICT',
                `User with email ${body.email} is already registered.`,
                409
            );
        }

        const user: MockUser = {
            userId: generateId(),
            email: body.email,
            password: body.password,
            nickname: body.nickname,
            role: 'USER',
        };
        mockDb.users.push(user);

        const refreshToken = generateRefreshToken();
        storeRefreshToken(refreshToken, user.userId);
        return HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
            status: 201,
        });
    }
);

const login = http.post<never, LoginRequest>(
    `${BASE}/auth/login`,
    async ({ request }) => {
        await delay(LATENCY_MS);
        const body = await request.json();

        const user = mockDb.users.find((u) => u.email === body.email);
        if (!user || user.password !== body.password) {
            return err('UNAUTHORIZED', 'Invalid email or password.', 401);
        }

        const refreshToken = generateRefreshToken();
        storeRefreshToken(refreshToken, user.userId);
        return HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
            status: 200,
        });
    }
);

const refresh = http.post<never, never, AuthResponse | ErrorResponse>(
    `${BASE}/auth/refresh`,
    async () => {
        await delay(LATENCY_MS);

        const token = mockDb.currentRefreshToken;
        if (!token || !mockDb.activeRefreshTokens.has(token)) {
            return err(
                'UNAUTHORIZED',
                'Refresh token is missing or invalid.',
                401
            );
        }

        const userId = mockDb.activeRefreshTokens.get(token);
        const user = mockDb.users.find((u) => u.userId === userId);
        if (!user) {
            return err(
                'UNAUTHORIZED',
                'No user associated with refresh token.',
                401
            );
        }

        mockDb.activeRefreshTokens.delete(token);
        const newRefresh = generateRefreshToken();
        storeRefreshToken(newRefresh, user.userId);

        return HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
            status: 200,
        });
    }
);

const logout = http.post<never, never, undefined>(
    `${BASE}/auth/logout`,
    async () => {
        await delay(LATENCY_MS);
        const token = mockDb.currentRefreshToken;
        if (token) {
            mockDb.activeRefreshTokens.delete(token);
        }
        mockDb.currentRefreshToken = null;
        return new HttpResponse(null, { status: 204 });
    }
);

const profileMe = http.get(`${BASE}/profile/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return err('UNAUTHORIZED', 'Access token is missing.', 401);
    }

    const token = authHeader.slice('Bearer '.length);

    // Для теста refresh flow: токены, начинающиеся с "expired.", считаем протухшими.
    if (token.startsWith('expired.')) {
        return err('UNAUTHORIZED', 'Access token has expired.', 401);
    }

    const user = mockDb.users.at(-1);
    if (!user) {
        return err('UNAUTHORIZED', 'No user found.', 401);
    }

    return HttpResponse.json({
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
    });
});

export const authHandlers: HttpHandler[] = [
    register,
    login,
    refresh,
    logout,
    profileMe,
];
