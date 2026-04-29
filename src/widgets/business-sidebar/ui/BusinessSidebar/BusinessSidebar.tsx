import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/features/auth';
import { venuesStore } from '@/entities/venue';
import styles from './BusinessSidebar.module.scss';
import { classNames } from '@/shared/utils/classNames';

interface NavItem {
    label: string;
    path?: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Заведения', path: '/business' },
    { label: 'Настройки' },
    { label: 'Карта', path: '/' },
];

export const BusinessSidebar = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (item: NavItem) => {
        if (!item.path) return;
        navigate(item.path);
    };

    const isActive = (item: NavItem): boolean => {
        if (!item.path) return false;
        if (item.path === '/business') {
            return location.pathname.startsWith('/business');
        }
        return location.pathname === item.path;
    };

    const venuesCount = venuesStore.list.data?.length ?? 0;

    return (
        <aside className={styles['business-sidebar']}>
            <h2 className={styles['business-sidebar__title']}>
                Профиль бизнеса
            </h2>

            {/* TODO: заменю в некст PR на email (#TBD) */}
            {authStore.user && (
                <p className={styles['business-sidebar__user']}>
                    {authStore.user.userId}
                </p>
            )}

            <p className={styles['business-sidebar__count']}>
                Всего заведений: {venuesCount}
            </p>

            <nav className={styles['business-sidebar__nav']}>
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        type='button'
                        onClick={() => handleNavClick(item)}
                        disabled={!item.path}
                        className={classNames(
                            styles['business-sidebar__nav-item'],
                            isActive(item)
                                ? styles['business-sidebar__nav-item--active']
                                : '',
                            !item.path
                                ? styles['business-sidebar__nav-item--disabled']
                                : ''
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
});
