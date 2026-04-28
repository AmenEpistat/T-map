import { Outlet } from 'react-router-dom';
import { BusinessSidebar } from '@/widgets/business-sidebar';
import styles from './BusinessLayout.module.scss';

export const BusinessLayout = () => {
    return (
        <div className={styles['business-layout']}>
            <BusinessSidebar />
            <main className={styles['business-layout__content']}>
                <Outlet />
            </main>
        </div>
    );
};
