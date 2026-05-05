import type { VenueCategory } from './types';

export const VENUE_CATEGORY_OPTIONS = [
    { value: 'food', label: 'Еда и напитки' },
    { value: 'entertainment', label: 'Развлечения' },
    { value: 'shopping', label: 'Шоппинг' },
] satisfies { value: VenueCategory; label: string }[];
