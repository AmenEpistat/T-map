import type { VenueModerationStatus } from '@/entities/venue';
import styles from './StatusBadge.module.scss';
import { classNames } from '@/shared/utils/classNames';

interface StatusBadgeProps {
    status: VenueModerationStatus;
}

const STATUS_LABELS: Record<VenueModerationStatus, string> = {
    PENDING: 'На модерации',
    PENDING_UPDATE: 'Правки на модерации',
    ACTIVE: 'Активно',
    REJECTED: 'Отклонено',
};

const STATUS_MODIFIERS: Record<VenueModerationStatus, string> = {
    PENDING: 'status-badge--pending',
    PENDING_UPDATE: 'status-badge--pending',
    ACTIVE: 'status-badge--active',
    REJECTED: 'status-badge--rejected',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <span
            className={classNames(
                styles['status-badge'],
                styles[STATUS_MODIFIERS[status]]
            )}
        >
            {STATUS_LABELS[status]}
        </span>
    );
};
