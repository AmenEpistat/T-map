import { http, HttpResponse, delay } from "msw";
import type { HttpHandler } from "msw";
import type {
  AuthResponse,
  ErrorResponse,
  LoginRequest,
  RegisterRequest,
} from "@/shared/api/types";
import { env } from "@/shared/config/env";
import { mockDb, type MockUser } from "../db";

const BASE = env.API_BASE_URL;

// Mimics real-world latency so race conditions in interceptors surface locally
const LATENCY_MS = 300;

// Helpers
const generateId = () => crypto.randomUUID();
const generateAccessToken = (userId: string) =>
  // Real JWT not needed in mocks — an opaque string is enough for tests
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
  // MSW doesn't set httpOnly for us — but the behaviour we care about
  // (cookie sent with credentials) works regardless
  response.headers.set(
    "Set-Cookie",
    `refreshToken=${token}; Path=/; HttpOnly; SameSite=Lax`,
  );
  return response;
};

// ──────────────────────────────────────────────────────────
// POST /auth/register
// ──────────────────────────────────────────────────────────
const register = http.post<never, RegisterRequest>(
  `${BASE}/auth/register`,
  async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();

    if (mockDb.users.some((u) => u.email === body.email)) {
      return err(
        "CONFLICT",
        `User with email ${body.email} is already registered.`,
        409,
      );
    }

    const user: MockUser = {
      userId: generateId(),
      email: body.email,
      password: body.password,
      nickname: body.nickname,
      role: "USER",
    };
    mockDb.users.push(user);

    const refreshToken = generateRefreshToken();
    const response = HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
      status: 201,
    });
    return setRefreshCookie(response, refreshToken);
  },
);

// ──────────────────────────────────────────────────────────
// POST /auth/login
// ──────────────────────────────────────────────────────────
const login = http.post<never, LoginRequest>(
  `${BASE}/auth/login`,
  async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();

    const user = mockDb.users.find((u) => u.email === body.email);
    if (!user || user.password !== body.password) {
      return err("UNAUTHORIZED", "Invalid email or password.", 401);
    }

    const refreshToken = generateRefreshToken();
    const response = HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
      status: 200,
    });
    return setRefreshCookie(response, refreshToken);
  },
);

// ──────────────────────────────────────────────────────────
// POST /auth/refresh
// ──────────────────────────────────────────────────────────
const refresh = http.post(`${BASE}/auth/refresh`, async ({ cookies }) => {
  await delay(LATENCY_MS);

  const token = cookies.refreshToken;
  if (!token || !mockDb.activeRefreshTokens.has(token)) {
    return err("UNAUTHORIZED", "Refresh token is missing or invalid.", 401);
  }

  // Rotate: the old token is invalidated, a new one is issued
  mockDb.activeRefreshTokens.delete(token);

  // We don't know which user the token belongs to in this simple mock.
  // In a real backend the token itself would carry a userId.
  // For now pick the most recently registered/logged-in user — good enough
  // to demonstrate the refresh flow.
  const user = mockDb.users.at(-1);
  if (!user) {
    return err("UNAUTHORIZED", "No user associated with refresh token.", 401);
  }

  const newRefresh = generateRefreshToken();
  const response = HttpResponse.json<AuthResponse>(buildAuthResponse(user), {
    status: 200,
  });
  return setRefreshCookie(response, newRefresh);
});

// ──────────────────────────────────────────────────────────
// POST /auth/logout
// ──────────────────────────────────────────────────────────
const logout = http.post(`${BASE}/auth/logout`, async ({ cookies }) => {
  await delay(LATENCY_MS);
  const token = cookies.refreshToken;
  if (token) {
    mockDb.activeRefreshTokens.delete(token);
  }
  return new HttpResponse(null, { status: 204 });
});

export const authHandlers: HttpHandler[] = [register, login, refresh, logout];
