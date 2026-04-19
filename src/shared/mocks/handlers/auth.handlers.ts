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
    accessToken: generateAccessToken(user.userId),
});

const setRefreshCookie = (response: Response, token: string): Response => {
    mockDb.activeRefreshTokens.add(token);
    response.headers.set(
        'Set-Cookie',
        `refreshToken=${token}; Path=/; HttpOnly; SameSite=Lax`
    );
    return response;
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
        const response = HttpResponse.json<AuthResponse>(
            buildAuthResponse(user),
            {
                status: 201,
            }
        );
        return setRefreshCookie(response, refreshToken);
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
        const response = HttpResponse.json<AuthResponse>(
            buildAuthResponse(user),
            {
                status: 200,
            }
        );
        return setRefreshCookie(response, refreshToken);
    }
);

const refresh = http.post(`${BASE}/auth/refresh`, async ({ cookies }) => {
    await delay(LATENCY_MS);

    const token = cookies.refreshToken;
    if (!token || !mockDb.activeRefreshTokens.has(token)) {
        return err('UNAUTHORIZED', 'Refresh token is missing or invalid.', 401);
    }

    mockDb.activeRefreshTokens.delete(token);

    const user = mockDb.users.at(-1);
    if (!user) {
        return err(
            'UNAUTHORIZED',
            'No user associated with refresh token.',
            401
        );
    }

    const newRefresh = generateRefreshToken();
    const response = HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
        status: 200,
    });
    return setRefreshCookie(response, newRefresh);
});

const logout = http.post(`${BASE}/auth/logout`, async ({ cookies }) => {
    await delay(LATENCY_MS);
    const token = cookies.refreshToken;
    if (token) {
        mockDb.activeRefreshTokens.delete(token);
    }
    return new HttpResponse(null, { status: 204 });
});

export const authHandlers: HttpHandler[] = [register, login, refresh, logout];
