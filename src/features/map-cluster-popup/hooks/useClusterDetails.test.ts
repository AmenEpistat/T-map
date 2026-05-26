import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { runInAction } from 'mobx';
import { useClusterDetails } from './useClusterDetails';
import { mapStore } from '@/entities/map';
import { publicVenueStore } from '@/entities/public-venue';

const {
    mockLoadClusterDetails,
    mockClose,
    mockOpen,
    mockHandleShare,
    mockResetDetail,
} = vi.hoisted(() => ({
    mockLoadClusterDetails: vi.fn().mockResolvedValue(undefined),
    mockClose: vi.fn(),
    mockOpen: vi.fn(),
    mockHandleShare: vi.fn(),
    mockResetDetail: vi.fn(),
}));

vi.mock('@/shared/hooks/useMapPopup.ts', () => ({
    useMapPopup: vi.fn().mockImplementation(({ reset }) => ({
        close: mockClose,
        open: mockOpen,
        handleShare: mockHandleShare,
        _internalReset: reset,
    })),
}));

vi.mock('@/entities/map', async () => {
    const { observable, action } = await import('mobx');

    const store = observable({
        selectedClusterIndex: null as string | null,
        isAnomaliesVisible: false,
        clusterDetail: {
            data: null,
            isLoading: false,
            reset: mockResetDetail,
        },
        get isClusterSelected() {
            return this.selectedClusterIndex !== null;
        },
    });

    const setClusterIndex = action((index: string | null) => {
        store.selectedClusterIndex = index;
    });

    return {
        mapStore: Object.assign(store, {
            setClusterIndex,
            loadClusterDetails: mockLoadClusterDetails,
        }),
    };
});

vi.mock('@/entities/public-venue', () => ({
    publicVenueStore: {
        setSelectedVenueIndex: vi.fn(),
    },
}));

vi.mock('react-router-dom', () => ({
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

describe('useClusterDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        runInAction(() => {
            mapStore.selectedClusterIndex = null;
        });
    });

    describe('начальное состояние', () => {
        it('возвращает data и isLoading из clusterDetail', () => {
            const { result } = renderHook(() => useClusterDetails());
            expect(result.current.data).toBeNull();
            expect(result.current.isLoading).toBe(false);
        });

        it('isPopupOpen false если кластер не выбран', () => {
            const { result } = renderHook(() => useClusterDetails());
            expect(result.current.isPopupOpen).toBe(false);
        });
    });

    describe('реакция на selectedClusterIndex', () => {
        it('вызывает loadClusterDetails при появлении h3Index', async () => {
            renderHook(() => useClusterDetails());

            act(() => {
                runInAction(() => {
                    mapStore.selectedClusterIndex = 'abc123';
                });
            });

            await waitFor(() => {
                expect(mockLoadClusterDetails).toHaveBeenCalled();
            });
        });

        it('сбрасывает selectedVenueIndex при выборе кластера', async () => {
            renderHook(() => useClusterDetails());

            act(() => {
                runInAction(() => {
                    mapStore.selectedClusterIndex = 'abc123';
                });
            });

            await waitFor(() => {
                expect(
                    publicVenueStore.setSelectedVenueIndex
                ).toHaveBeenCalledWith(null);
            });
        });

        it('открывает popup через open(h3Index)', async () => {
            renderHook(() => useClusterDetails());

            act(() => {
                runInAction(() => {
                    mapStore.selectedClusterIndex = 'abc123';
                });
            });

            await waitFor(() => {
                expect(mockOpen).toHaveBeenCalledWith('abc123');
            });
        });

        it('не делает запрос если h3Index null', async () => {
            renderHook(() => useClusterDetails());

            act(() => {
                runInAction(() => {
                    mapStore.selectedClusterIndex = null;
                });
            });

            await new Promise((r) => setTimeout(r, 20));
            expect(mockLoadClusterDetails).not.toHaveBeenCalled();
        });
    });

    describe('dispose', () => {
        it('отписывается при анмаунте', async () => {
            const { unmount } = renderHook(() => useClusterDetails());
            unmount();

            act(() => {
                runInAction(() => {
                    mapStore.selectedClusterIndex = 'after-unmount';
                });
            });

            await new Promise((r) => setTimeout(r, 20));
            expect(mockLoadClusterDetails).not.toHaveBeenCalled();
        });
    });
});
