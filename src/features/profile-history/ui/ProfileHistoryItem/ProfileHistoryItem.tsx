import styles from './ProfileHistoryItem.module.scss';
import type { Loyalty } from '@/shared/api/types/loyalty.ts';
import { MAPPING_CATEGORIES } from '@/entities/map';

interface Props {
    item: Loyalty;
}

const ProfileHistoryItem = ({ item }: Props) => {
    return (
        <div className={styles['history']}>
            <p className={styles['history__count']}>
                {item.discountApplied}
                <span className={styles['history__procent']}>%</span>
            </p>
            <p className={styles['history__venue']}>
                {item.venueName}
                <span className={styles['history__category']}>
                    {MAPPING_CATEGORIES[item.category]}
                </span>
            </p>
            <p className={styles['history__description']}>
                {item.ruleDescription}
            </p>
        </div>
    );
};

export default ProfileHistoryItem;
