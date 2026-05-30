import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/config/env';
import { getAccessToken, setAccessToken } from './token-holder';
import type { AuthResponse } from './types';
import qs from 'qs';

export const apiClient = axios.create({
    baseURL: env.API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
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

let refreshPromise: Promise<AuthResponse> | null = null;

export const refreshAuthSession = (): Promise<AuthResponse> => {
    refreshPromise ??= apiClient
        .post<AuthResponse>('/auth/refresh')
        .then((response) => {
            setAccessToken(response.data.accessToken);
            return response.data;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
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

        try {
            const response = await refreshAuthSession();
            onRefreshSuccess?.(response.accessToken);
        } catch (refreshError) {
            onRefreshFail?.();
            throw refreshError;
        }

        return apiClient(original);
    }
);
