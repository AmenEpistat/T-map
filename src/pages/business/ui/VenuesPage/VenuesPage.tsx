import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { MyVenuesList } from '@/features/my-venues-list';
import styles from './VenuesPage.module.scss';

export const VenuesPage = observer(() => {
    return (
        <div className={styles['venues-page']}>
            <header className={styles['venues-page__header']}>
                <h1 className={styles['venues-page__title']}>Заведения</h1>
                <p className={styles['venues-page__subtitle']}>
                    управляйте своими заведениями
                </p>
            </header>

            <div className={styles['venues-page__columns']}>
                <div className={styles['venues-page__list']}>
                    <MyVenuesList />
                </div>
                <div className={styles['venues-page__form']}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
});
