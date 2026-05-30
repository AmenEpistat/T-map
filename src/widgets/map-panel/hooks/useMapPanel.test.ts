import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMapPanel } from './useMapPanel';
import { useSearchParams } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
    useSearchParams: vi.fn(),
}));

describe('Хук useMapPanel', () => {
    let mockSearchParams: URLSearchParams;
    let mockSetSearchParams: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchParams = new URLSearchParams();
        mockSetSearchParams = vi.fn();
        vi.mocked(useSearchParams).mockReturnValue([
            mockSearchParams,
            mockSetSearchParams,
        ]);
    });

    it('инициализируется с дефолтными значениями', () => {
        const { result } = renderHook(() => useMapPanel());
        expect(result.current.isSearchOpen).toBe(false);
        expect(result.current.isPanelOpen).toBe(false);
    });

    it('закрывает поиск, если в URL есть параметры заведения (venue) или кластера (cluster)', () => {
        let currentParams = new URLSearchParams();
        vi.mocked(useSearchParams).mockImplementation(() => [
            currentParams,
            mockSetSearchParams,
        ]);

        const { result, rerender } = renderHook(() => useMapPanel());

        act(() => {
            result.current.setSearchOpen(true);
        });
        expect(result.current.isSearchOpen).toBe(true);

        currentParams = new URLSearchParams('venue=123');
        vi.mocked(useSearchParams).mockImplementation(() => [
            currentParams,
            mockSetSearchParams,
        ]);

        rerender();

        expect(result.current.isSearchOpen).toBe(false);
    });

    it('handleOpenProfile устанавливает параметр профиля в URL', () => {
        const { result } = renderHook(() => useMapPanel());

        act(() => {
            result.current.handleOpenProfile();
        });

        expect(mockSetSearchParams).toHaveBeenCalledWith(
            expect.any(URLSearchParams)
        );
        const passedParams = vi.mocked(mockSetSearchParams).mock.calls[0][0];
        expect(passedParams.has('profile')).toBe(true);
    });

    it('handleCloseProfile удаляет параметр профиля из URL', () => {
        mockSearchParams.set('profile', '');
        const { result } = renderHook(() => useMapPanel());

        act(() => {
            result.current.handleCloseProfile();
        });

        expect(mockSearchParams.has('profile')).toBe(false);
        expect(mockSetSearchParams).toHaveBeenCalledWith(mockSearchParams);
    });

    it('isPanelOpen возвращает true, если в URL присутствует параметр профиля', () => {
        mockSearchParams.set('profile', '');
        const { result } = renderHook(() => useMapPanel());
        expect(result.current.isPanelOpen).toBe(true);
    });
});
