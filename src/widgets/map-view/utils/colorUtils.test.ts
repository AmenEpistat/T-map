import { describe, it, expect } from 'vitest';
import { getClusterColor, getBorderColor } from './colorUtils';

describe('Утилиты цветов (colorUtils)', () => {
    describe('Функция getClusterColor', () => {
        it('корректно ограничивает минимальные и максимальные значения прозрачности', () => {
            const minColor = getClusterColor(-10, 100);
            const maxColor = getClusterColor(200, 100);

            expect(minColor).toEqual([76, 38, 246, 30]);
            expect(maxColor).toEqual([76, 38, 246, 140]);
        });

        it('высчитывает промежуточное значение прозрачности по коэффициенту', () => {
            const midColor = getClusterColor(50, 100);
            expect(midColor[3]).toBeGreaterThan(30);
            expect(midColor[3]).toBeLessThan(140);
        });
    });

    describe('Функция getBorderColor', () => {
        it('возвращает затемненный цвет для обводки с полной непрозрачностью', () => {
            const borderColor = getBorderColor(50, 100);
            expect(borderColor[3]).toBe(255);
            expect(borderColor[0]).toBeLessThan(76);
        });
    });
});
