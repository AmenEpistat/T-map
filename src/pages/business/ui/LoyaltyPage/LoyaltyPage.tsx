import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { LoyaltyRulesList } from '@/features/loyalty-rules-list';
import { loyaltyRulesStore } from '@/entities/loyalty-rule';
import { classNames } from '@/shared/utils/classNames';
import styles from './LoyaltyPage.module.scss';

export const LoyaltyPage = observer(() => {
    const { id: venueId = '' } = useParams<{ id: string }>();
    const location = useLocation();
    const isFormOpen = !location.pathname.endsWith('/loyalty');

    useEffect(() => {
        return () => {
            loyaltyRulesStore.clear();
        };
    }, []);

    return (
        <div className={styles['loyalty-page']}>
            <header className={styles['loyalty-page__header']}>
                <h1 className={styles['loyalty-page__title']}>
                    Программа лояльности
                </h1>
                <p className={styles['loyalty-page__subtitle']}>
                    управляйте акциями заведения
                </p>
            </header>

            <div className={styles['loyalty-page__columns']}>
                <div
                    className={classNames(
                        styles['loyalty-page__list'],
                        isFormOpen
                            ? styles['loyalty-page__list--hidden-on-mobile']
                            : ''
                    )}
                >
                    <LoyaltyRulesList venueId={venueId} />
                </div>
                <div
                    className={classNames(
                        styles['loyalty-page__form'],
                        !isFormOpen
                            ? styles['loyalty-page__form--hidden-on-mobile']
                            : ''
                    )}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
});
