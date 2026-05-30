import { describe, it, expect } from 'vitest';
import { getIconMapping } from './iconUtils';

describe('Утилиты иконок (iconUtils)', () => {
    it('трансформирует json-структуру атласа в плоский маппинг объектов Deck.gl', () => {
        const mockJson = {
            frames: [
                {
                    filename: 'leisure.svg',
                    frame: { x: 10, y: 20, w: 30, h: 40 },
                    rotated: false,
                    trimmed: false,
                },
            ],
        };

        const result = getIconMapping(mockJson);

        expect(result['leisure']).toEqual({
            x: 10,
            y: 20,
            width: 30,
            height: 40,
            anchorX: 30,
            anchorY: 40,
            mask: false,
        });
    });
});
