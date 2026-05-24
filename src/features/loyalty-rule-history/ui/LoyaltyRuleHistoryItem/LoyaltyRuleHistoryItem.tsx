import type { BusinessLoyaltyVerificationResponse } from '@/shared/api';
import styles from './LoyaltyRuleHistoryItem.module.scss';

interface Props {
    item: BusinessLoyaltyVerificationResponse;
}

export const LoyaltyRuleHistoryItem = ({ item }: Props) => {
    const date = new Date(item.verifiedAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={styles['history-item']}>
            <div className={styles['history-item__info']}>
                <span className={styles['history-item__label']}>
                    {item.userLabel}
                </span>
                <span className={styles['history-item__date']}>{date}</span>
            </div>
        </div>
    );
};
