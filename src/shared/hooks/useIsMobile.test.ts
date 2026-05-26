import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';
import { TABLET_WIDTH } from '@/shared/model/constants';

describe('useIsMobile', () => {
    const setWidth = (width: number) => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
        });
    };

    beforeEach(() => setWidth(1024));

    it('false на десктопе', () => {
        setWidth(TABLET_WIDTH + 1);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('true на мобильном', () => {
        setWidth(TABLET_WIDTH - 1);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('обновляется при resize', () => {
        setWidth(1024);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        act(() => {
            setWidth(320);
            window.dispatchEvent(new Event('resize'));
        });

        expect(result.current).toBe(true);
    });

    it('снимает обработчик при анмаунте', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = renderHook(() => useIsMobile());
        unmount();
        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
});
