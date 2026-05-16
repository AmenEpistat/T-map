import { Outlet } from 'react-router-dom';
import styles from './AdminModerationPage.module.scss';
import { ModerationQueueList } from '@/features/moderation-queue';

export const AdminModerationPage = () => {
    return (
        <section className={styles['admin-moderation-page']}>
            <header className={styles['admin-moderation-page__header']}>
                <h1 className={styles['admin-moderation-page__title']}>
                    Заявки
                </h1>
            </header>

            <div className={styles['admin-moderation-page__columns']}>
                <div className={styles['admin-moderation-page__queue']}>
                    <ModerationQueueList />
                </div>

                <div className={styles['admin-moderation-page__details']}>
                    <Outlet />
                </div>
            </div>
        </section>
    );
};
