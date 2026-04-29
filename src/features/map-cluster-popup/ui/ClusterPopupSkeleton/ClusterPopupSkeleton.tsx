import { Skeleton } from 'antd';
import styles from './ClusterPopupSkeleton.module.scss';

export const ClusterPopupSkeleton = () => {
    return (
        <div className={styles['skeleton']}>
            <div className={styles['skeleton__image-wrapper']}>
                <Skeleton.Button
                    active
                    block
                    className={styles['skeleton__image']}
                />
            </div>

            <div className={styles['skeleton__content']}>
                <div className={styles['skeleton__header']}>
                    <Skeleton.Input
                        active
                        className={styles['skeleton__title']}
                    />
                    <div className={styles['skeleton__actions']}>
                        <Skeleton.Avatar active size='small' shape='square' />
                        <Skeleton.Avatar active size='small' shape='square' />
                    </div>
                </div>

                <div className={styles['skeleton__stats']}>
                    <div className={styles['skeleton__stat-item']}>
                        <Skeleton.Input active size='small' />
                        <Skeleton.Input active size='small' />
                    </div>
                    <div className={styles['skeleton__stat-item']}>
                        <Skeleton.Input active size='small' />
                        <Skeleton.Input active size='small' />
                    </div>
                    <div className={styles['skeleton__stat-item']}>
                        <Skeleton.Input active size='small' />
                        <Skeleton.Input active size='small' />
                    </div>
                </div>
            </div>
        </div>
    );
};
