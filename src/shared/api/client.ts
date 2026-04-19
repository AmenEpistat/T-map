import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/config/env';
import { getAccessToken, setAccessToken } from './token-holder';

export const apiClient = axios.create({
    baseURL: env.API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

const runRefresh = async (): Promise<string> => {
    const response = await apiClient.post<{ accessToken: string }>(
        '/auth/refresh'
    );
    const newToken = response.data.accessToken;
    setAccessToken(newToken);
    return newToken;
};

let onRefreshSuccess: ((token: string) => void) | null = null;
let onRefreshFail: (() => void) | null = null;

export const registerAuthCallbacks = (handlers: {
    onRefreshSuccess?: (token: string) => void;
    onRefreshFail?: () => void;
}): void => {
    onRefreshSuccess = handlers.onRefreshSuccess ?? null;
    onRefreshFail = handlers.onRefreshFail ?? null;
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetriableConfig | undefined;

        if (!original || error.response?.status !== 401) {
            throw error;
        }
        if (original._retry) {
            throw error;
        }
        if (original.url?.includes('/auth/refresh')) {
            throw error;
        }

        original._retry = true;

        refreshPromise ??= runRefresh()
            .then((token) => {
                onRefreshSuccess?.(token);
                return token;
            })
            .catch((refreshError) => {
                onRefreshFail?.();
                throw refreshError;
            })
            .finally(() => {
                refreshPromise = null;
            });

        await refreshPromise;
        return apiClient(original);
    }
);
