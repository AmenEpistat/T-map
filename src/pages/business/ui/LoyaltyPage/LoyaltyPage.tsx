import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { LoyaltyRulesList } from '@/features/loyalty-rules-list';
import { loyaltyRulesStore } from '@/entities/loyalty-rule';
import { venuesStore } from '@/entities/venue';
import { classNames } from '@/shared/utils/classNames';
import styles from './LoyaltyPage.module.scss';

export const LoyaltyPage = observer(() => {
    const { id: venueId = '' } = useParams<{ id: string }>();
    const location = useLocation();
    const isFormOpen = !location.pathname.endsWith('/loyalty');

    const navigate = useNavigate();
    const venueName = venuesStore.current.data?.name ?? null;

    const handleBack = (): void => {
        navigate(`/business/${venueId}`);
    };

    useEffect(() => {
        return () => {
            loyaltyRulesStore.clear();
        };
    }, []);

    return (
        <div className={styles['loyalty-page']}>
            <header className={styles['loyalty-page__header']}>
                <div className={styles['loyalty-page__header-row']}>
                    <button
                        type='button'
                        onClick={handleBack}
                        className={styles['loyalty-page__back']}
                        aria-label='Вернуться к управлению заведением'
                    >
                        <ArrowLeftOutlined />
                    </button>
                    {venueName && (
                        <h1 className={styles['loyalty-page__title']}>
                            {venueName}
                        </h1>
                    )}
                </div>
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
