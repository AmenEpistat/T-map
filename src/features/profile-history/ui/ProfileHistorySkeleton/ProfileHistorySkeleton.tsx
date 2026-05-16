import { Skeleton } from 'antd';
import styles from './ProfileHistorySkeleton.module.scss';
import { PAGE_SIZE } from '@/entities/profile';

const ProfileHistorySkeleton = () => {
    const skeletonItems = Array.from({ length: PAGE_SIZE });

    return (
        <div className={styles['history-skeleton']}>
            {skeletonItems.map((_, index) => (
                <div key={index} className={styles['history-skeleton__item']}>
                    <Skeleton.Avatar
                        className={styles['history-skeleton__avatar']}
                        active
                        shape='square'
                        size={74}
                    />

                    <Skeleton
                        active
                        paragraph={{ rows: 2, width: ['60%', '90%'] }}
                        title={{ width: '40%' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProfileHistorySkeleton;
