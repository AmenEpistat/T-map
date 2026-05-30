import { AdminUsersList } from '@/features/admin-users-management';
import styles from './AdminUsersPage.module.scss';

export const AdminUsersPage = () => {
    return (
        <section className={styles['admin-users-page']}>
            <header className={styles['admin-users-page__header']}>
                <h1 className={styles['admin-users-page__title']}>
                    Пользователи
                </h1>
                <p className={styles['admin-users-page__description']}>
                    Управляйте пользователями T-map
                </p>
            </header>

            <AdminUsersList />
        </section>
    );
};
