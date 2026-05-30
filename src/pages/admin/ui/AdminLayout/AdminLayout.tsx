import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import styles from './AdminLayout.module.scss';

export const AdminLayout = () => {
    return (
        <div className={styles['admin-layout']}>
            <AdminSidebar />
            <main className={styles['admin-layout__content']}>
                <Outlet />
            </main>
        </div>
    );
};
