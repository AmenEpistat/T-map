import { Skeleton } from 'antd';
import styles from '../VenuePromoItem/VenuePromoItem.module.scss';

const VenuePromoSkeleton = () => {
    return (
        <div className={styles['promo-skeleton']}>
            <div className={`${styles['promo']} ${styles['promo--skeleton']}`}>
                <div className={styles['promo__content']}>
                    <h3 className={styles['promo__description']}>
                        <Skeleton.Input active size='small' block />
                    </h3>

                    <p className={styles['promo__price']}>
                        <Skeleton.Input
                            active
                            className={styles['promo--skeleton__price']}
                        />
                    </p>

                    <p className={styles['promo__usages']}>
                        <Skeleton.Button
                            active
                            size='small'
                            className={styles['promo--skeleton__usages']}
                        />
                    </p>
                </div>

                <div className={styles['promo__qrcode']}>
                    <Skeleton.Button
                        active
                        className={styles['promo__btn']}
                        style={{ width: '110px', height: '32px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VenuePromoSkeleton;
