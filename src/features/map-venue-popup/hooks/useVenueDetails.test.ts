import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { runInAction } from 'mobx';
import { useVenueDetails } from './useVenueDetails';
import { publicVenueStore } from '@/entities/public-venue';
import { mapStore } from '@/entities/map';

const {
    mockLoadVenueDetails,
    mockClose,
    mockOpen,
    mockHandleShare,
    mockResetDetail,
} = vi.hoisted(() => ({
    mockLoadVenueDetails: vi.fn().mockResolvedValue(undefined),
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

vi.mock('@/entities/public-venue', async () => {
    const { observable, action } = await import('mobx');

    const store = observable({
        selectedVenueIndex: null as string | null,
        venueDetail: { data: null, isLoading: false, reset: mockResetDetail },
        get isVenueSelected() {
            return this.selectedVenueIndex !== null;
        },
    });

    const setSelectedVenueIndex = action((id: string | null) => {
        store.selectedVenueIndex = id;
    });

    return {
        publicVenueStore: Object.assign(store, {
            setSelectedVenueIndex,
            loadVenueDetails: mockLoadVenueDetails,
        }),
    };
});

vi.mock('@/entities/map', () => ({
    mapStore: { setClusterIndex: vi.fn() },
}));

describe('useVenueDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        runInAction(() => {
            publicVenueStore.selectedVenueIndex = null;
        });
    });

    it('возвращает data и isLoading из стора', () => {
        const { result } = renderHook(() => useVenueDetails());
        expect(result.current.data).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('вызывает loadVenueDetails при появлении selectedVenueIndex', async () => {
        renderHook(() => useVenueDetails());

        act(() => {
            runInAction(() => {
                publicVenueStore.selectedVenueIndex = 'venue_123';
            });
        });

        await waitFor(() => {
            expect(mockLoadVenueDetails).toHaveBeenCalled();
        });
    });

    it('сбрасывает clusterIndex при выборе venue', async () => {
        renderHook(() => useVenueDetails());

        act(() => {
            runInAction(() => {
                publicVenueStore.selectedVenueIndex = 'venue_123';
            });
        });

        await waitFor(() => {
            expect(mapStore.setClusterIndex).toHaveBeenCalledWith(null);
        });
    });

    it('открывает popup через open', async () => {
        renderHook(() => useVenueDetails());

        act(() => {
            runInAction(() => {
                publicVenueStore.selectedVenueIndex = 'venue_123';
            });
        });

        await waitFor(() => {
            expect(mockOpen).toHaveBeenCalledWith('venue_123');
        });
    });

    it('отписывается от реакции при размонтировании (dispose)', async () => {
        const { unmount } = renderHook(() => useVenueDetails());

        unmount();

        act(() => {
            runInAction(() => {
                publicVenueStore.selectedVenueIndex = 'venue_after_unmount';
            });
        });

        await new Promise((r) => setTimeout(r, 20));
        expect(mockLoadVenueDetails).not.toHaveBeenCalled();
    });
});
