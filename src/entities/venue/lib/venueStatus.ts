import type { VenueModerationStatus } from '@/entities/venue';

export const VENUE_STATUS_LABELS: Record<VenueModerationStatus, string> = {
    PENDING: 'На модерации',
    PENDING_UPDATE: 'Правки на модерации',
    ACTIVE: 'Активно',
    REJECTED: 'Отклонено',
};

export const VENUE_STATUS_COLORS: Record<VenueModerationStatus, string> = {
    PENDING: 'warning',
    PENDING_UPDATE: 'warning',
    ACTIVE: 'success',
    REJECTED: 'error',
};
