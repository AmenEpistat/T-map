import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { runInAction } from 'mobx';
import { useLoyaltyHistory } from './useLoyaltyHistory';
import { profileStore } from '@/entities/profile';

const { mockLoadLoyaltyHistory } = vi.hoisted(() => ({
    mockLoadLoyaltyHistory: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/entities/profile', async () => {
    const { observable, action } = await import('mobx');

    const store = observable({
        loyaltyHistory: { data: null, isLoading: false },
        page: 0,
        setPage: action((p: number) => {
            store.page = p;
        }),
    });

    return {
        profileStore: Object.assign(store, {
            loadLoyaltyHistory: mockLoadLoyaltyHistory,
        }),
    };
});

describe('useLoyaltyHistory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        runInAction(() => {
            profileStore.page = 0;
        });
    });

    it('вызывает loadLoyaltyHistory сразу при инициализации (fireImmediately)', async () => {
        renderHook(() => useLoyaltyHistory());

        await waitFor(() => {
            expect(mockLoadLoyaltyHistory).toHaveBeenCalledTimes(1);
        });
    });

    it('вызывает loadLoyaltyHistory при смене страницы в сторе', async () => {
        renderHook(() => useLoyaltyHistory());

        await waitFor(() =>
            expect(mockLoadLoyaltyHistory).toHaveBeenCalledTimes(1)
        );

        act(() => {
            runInAction(() => {
                profileStore.page = 2;
            });
        });

        await waitFor(() => {
            expect(mockLoadLoyaltyHistory).toHaveBeenCalledTimes(2);
        });
    });

    it('метод setPage вызывает profileStore.setPage', () => {
        const { result } = renderHook(() => useLoyaltyHistory());

        act(() => {
            result.current.setPage(3);
        });

        expect(profileStore.page).toBe(3);
    });

    it('возвращает корректные data и isLoading из стора', () => {
        const { result } = renderHook(() => useLoyaltyHistory());

        expect(result.current.data).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('отписывается от реакции при размонтировании (dispose)', async () => {
        const { unmount } = renderHook(() => useLoyaltyHistory());

        await waitFor(() =>
            expect(mockLoadLoyaltyHistory).toHaveBeenCalledTimes(1)
        );

        unmount();

        act(() => {
            runInAction(() => {
                profileStore.page = 5;
            });
        });

        await new Promise((r) => setTimeout(r, 20));
        expect(mockLoadLoyaltyHistory).toHaveBeenCalledTimes(1);
    });
});
