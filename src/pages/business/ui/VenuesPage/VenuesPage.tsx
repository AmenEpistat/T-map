import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import { MyVenuesList } from '@/features/my-venues-list';
import { classNames } from '@/shared/utils/classNames';
import styles from './VenuesPage.module.scss';

export const VenuesPage = observer(() => {
    const location = useLocation();
    const isCreating = location.pathname === '/business/new';

    return (
        <div className={styles['venues-page']}>
            <header className={styles['venues-page__header']}>
                <h1 className={styles['venues-page__title']}>Заведения</h1>
                <p className={styles['venues-page__subtitle']}>
                    управляйте своими заведениями
                </p>
            </header>

            <div className={styles['venues-page__columns']}>
                <div
                    className={classNames(
                        styles['venues-page__list'],
                        isCreating
                            ? styles['venues-page__list--hidden-on-mobile']
                            : ''
                    )}
                >
                    <MyVenuesList />
                </div>
                <div
                    className={classNames(
                        styles['venues-page__form'],
                        !isCreating
                            ? styles['venues-page__form--hidden-on-mobile']
                            : ''
                    )}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
});
