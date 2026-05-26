import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getAccessToken, setAccessToken } from './token-holder';
import {
    apiClient,
    refreshAuthSession,
    registerAuthCallbacks,
} from '@/shared/api/client.ts';
import MockAdapter from 'axios-mock-adapter';

vi.mock('./token-holder', () => ({
    getAccessToken: vi.fn(),
    setAccessToken: vi.fn(),
}));

vi.mock('@/shared/config/env', () => ({
    env: { API_BASE_URL: 'http://test.api' },
}));

const mock = new MockAdapter(apiClient);

describe('apiClient', () => {
    beforeEach(() => {
        mock.reset();
        vi.clearAllMocks();
        registerAuthCallbacks({});
    });

    describe('request interceptor', () => {
        it('добавляет Authorization если есть токен', async () => {
            vi.mocked(getAccessToken).mockReturnValue('my-token');
            mock.onGet('/test').reply(200, {});

            await apiClient.get('/test');

            const request = mock.history.get[0];
            expect(request.headers?.Authorization).toBe('Bearer my-token');
        });

        it('не добавляет Authorization без токена', async () => {
            vi.mocked(getAccessToken).mockReturnValue(null);
            mock.onGet('/test').reply(200, {});

            await apiClient.get('/test');

            const request = mock.history.get[0];
            expect(request.headers?.Authorization).toBeUndefined();
        });
    });

    describe('response interceptor — 401', () => {
        it('вызывает refresh при 401', async () => {
            vi.mocked(getAccessToken).mockReturnValue('old-token');

            mock.onGet('/protected').replyOnce(401);
            mock.onPost('/auth/refresh').replyOnce(200, {
                accessToken: 'new-token',
            });
            mock.onGet('/protected').replyOnce(200, { data: 'ok' });

            await apiClient.get('/protected');

            expect(setAccessToken).toHaveBeenCalledWith('new-token');
        });

        it('вызывает onRefreshSuccess с новым токеном', async () => {
            const onRefreshSuccess = vi.fn();
            registerAuthCallbacks({ onRefreshSuccess });

            mock.onGet('/protected').replyOnce(401);
            mock.onPost('/auth/refresh').replyOnce(200, {
                accessToken: 'new-token',
            });
            mock.onGet('/protected').replyOnce(200, {});

            await apiClient.get('/protected');
            expect(onRefreshSuccess).toHaveBeenCalledWith('new-token');
        });

        it('вызывает onRefreshFail если refresh упал', async () => {
            const onRefreshFail = vi.fn();
            registerAuthCallbacks({ onRefreshFail });

            mock.onGet('/protected').replyOnce(401);
            mock.onPost('/auth/refresh').replyOnce(401);

            await expect(apiClient.get('/protected')).rejects.toThrow();
            expect(onRefreshFail).toHaveBeenCalled();
        });

        it('не делает повторный refresh если уже retry', async () => {
            mock.onGet('/protected').reply(401);
            mock.onPost('/auth/refresh').replyOnce(200, {
                accessToken: 'new-token',
            });

            await expect(apiClient.get('/protected')).rejects.toThrow();
            expect(mock.history.post.length).toBe(1);
        });

        it('не делает refresh для /auth/refresh эндпоинта', async () => {
            mock.onPost('/auth/refresh').replyOnce(401);

            await expect(apiClient.post('/auth/refresh')).rejects.toThrow();

            expect(mock.history.post.length).toBe(1);
        });
    });

    describe('refreshAuthSession — дедупликация', () => {
        it('не делает два запроса если refresh уже идёт', async () => {
            mock.onPost('/auth/refresh').reply(200, { accessToken: 'token' });

            await Promise.all([refreshAuthSession(), refreshAuthSession()]);

            expect(mock.history.post.length).toBe(1);
        });
    });
});
