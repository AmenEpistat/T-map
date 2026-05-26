import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestState } from './RequestState';

vi.mock('antd', () => ({
    message: { error: vi.fn() },
}));

vi.mock('@/shared/api/types/error.ts', () => ({
    isErrorMessage: vi.fn(
        (e) =>
            e !== null &&
            typeof e === 'object' &&
            typeof e.message === 'string' &&
            typeof e.status === 'number'
    ),
}));

describe('RequestState', () => {
    let state: RequestState<{ name: string }>;

    beforeEach(() => {
        state = new RequestState();
    });

    describe('начальное состояние', () => {
        it('data null, isLoading false, error null', () => {
            expect(state.data).toBeNull();
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });
    });

    describe('execute — успех', () => {
        it('устанавливает data после успешного запроса', async () => {
            const mock = { data: { name: 'test' } };
            await state.execute(Promise.resolve(mock));
            expect(state.data).toEqual({ name: 'test' });
        });

        it('isLoading false после завершения', async () => {
            await state.execute(Promise.resolve({ data: { name: 'test' } }));
            expect(state.isLoading).toBe(false);
        });

        it('isLoading true во время запроса', async () => {
            let resolve: any;
            const promise = new Promise<{ data: { name: string } }>(
                (res) => (resolve = res)
            );

            const execution = state.execute(promise);
            expect(state.isLoading).toBe(true);

            resolve({ data: { name: 'test' } });
            await execution;
        });
    });

    describe('execute — ошибка', () => {
        it('устанавливает error при падении запроса', async () => {
            const error = { message: 'Нет доступа', status: 403 };
            await state.execute(Promise.reject(error));
            expect(state.error).toEqual({
                message: 'Нет доступа',
                status: 403,
            });
        });

        it('isLoading false после ошибки', async () => {
            await state.execute(
                Promise.reject({ message: 'err', status: 500 })
            );
            expect(state.isLoading).toBe(false);
        });

        it('дефолтное сообщение если ошибка не ErrorMessage', async () => {
            await state.execute(Promise.reject(new Error('unknown')));
            expect(state.error?.message).toBe('Ошибка загрузки данных');
            expect(state.error?.status).toBe(500);
        });

        it('показывает toast с сообщением', async () => {
            const { message } = await import('antd');
            await state.execute(
                Promise.reject({ message: 'Ошибка', status: 400 })
            );
            expect(message.error).toHaveBeenCalledWith('Ошибка');
        });
    });

    describe('гонка запросов', () => {
        it('игнорирует устаревший ответ', async () => {
            let resolveFirst: any;
            const first = new Promise<{ data: { name: string } }>(
                (res) => (resolveFirst = res)
            );
            const second = Promise.resolve({ data: { name: 'second' } });

            const p1 = state.execute(first);
            const p2 = state.execute(second);

            await p2;
            resolveFirst({ data: { name: 'first' } });
            await p1;

            expect(state.data?.name).toBe('second');
        });
    });

    describe('reset', () => {
        it('сбрасывает всё в начальное состояние', async () => {
            await state.execute(Promise.resolve({ data: { name: 'test' } }));
            state.reset();

            expect(state.data).toBeNull();
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });
    });
});
