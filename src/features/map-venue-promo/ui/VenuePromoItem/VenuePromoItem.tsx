import styles from './VenuePromoItem.module.scss';
import type { Promo } from '@/shared/api';
import { pluralize } from '@/shared/utils/pluralize.ts';
import { Button } from 'antd';

interface Props {
    item: Promo;
}

const VenuePromoItem = ({ item }: Props) => {
    const remainWord = pluralize(item.remainingUsages, [
        'применение',
        'применения',
        'применений',
    ]);

    return (
        <div className={styles['promo']}>
            <div className={styles['promo__content']}>
                <h3 className={styles['promo__description']}>
                    {item.description}
                </h3>
                <p className={styles['promo__price']}>
                    {item.discountPercent} <span>%</span>
                </p>
                <p className={styles['promo__usages']}>
                    Осталось {item.remainingUsages} {remainWord} из{' '}
                    {item.maxUsages}. Успей активировать
                </p>
            </div>
            <div className={styles['promo__qrcode']}>
                <Button
                    type={'text'}
                    className={styles['promo__btn']}
                    disabled={!item.active}
                >
                    Активировать
                </Button>
            </div>
        </div>
    );
};

export default VenuePromoItem;
