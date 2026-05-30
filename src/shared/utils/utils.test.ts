import { describe, it, expect, vi } from 'vitest';
import { classNames } from './classNames';
import { getErrorMessage } from './getErrorMessage';
import { pluralize } from './pluralize';
import { isAxiosError } from 'axios';

describe('classNames', () => {
    it('объединяет строки', () => {
        expect(classNames('a', 'b', 'c')).toBe('a b c');
    });

    it('фильтрует false значения', () => {
        expect(classNames('a', false, 'b')).toBe('a b');
    });

    it('возвращает пустую строку если всё false', () => {
        expect(classNames(false, false)).toBe('');
    });

    it('работает с одним классом', () => {
        expect(classNames('only')).toBe('only');
    });
});

vi.mock('axios', () => ({
    isAxiosError: vi.fn(),
    default: {},
}));

describe('getErrorMessage', () => {
    beforeEach(() => {
        vi.mocked(isAxiosError).mockReturnValue(false);
    });

    it('возвращает fallback для неизвестной ошибки', () => {
        expect(getErrorMessage('Ошибка', null)).toBe('Ошибка');
    });

    it('возвращает message из Error', () => {
        expect(getErrorMessage('Ошибка', new Error('Упало'))).toBe('Упало');
    });

    it('возвращает message из axios ответа', () => {
        vi.mocked(isAxiosError).mockReturnValue(true);

        const axiosError = {
            response: { data: { message: 'Нет доступа' } },
        };

        expect(getErrorMessage('Ошибка', axiosError)).toBe('Нет доступа');
    });

    it('возвращает fallback если axios response пуст', () => {
        vi.mocked(isAxiosError).mockReturnValue(true);

        const axiosError = { response: { data: {} } };
        expect(getErrorMessage('Ошибка', axiosError)).toBe('Ошибка');
    });
});

describe('pluralize', () => {
    const forms = ['яблоко', 'яблока', 'яблок'];

    it.each([
        [1, 'яблоко'],
        [2, 'яблока'],
        [3, 'яблока'],
        [5, 'яблок'],
        [11, 'яблок'],
        [12, 'яблок'],
        [21, 'яблоко'],
        [22, 'яблока'],
        [100, 'яблок'],
        [101, 'яблоко'],
    ])('%i → %s', (number, expected) => {
        expect(pluralize(number, forms)).toBe(expected);
    });

    it('работает с отрицательными числами', () => {
        expect(pluralize(-1, forms)).toBe('яблоко');
        expect(pluralize(-11, forms)).toBe('яблок');
    });
});
