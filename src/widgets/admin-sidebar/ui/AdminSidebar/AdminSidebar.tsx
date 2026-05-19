import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/features/auth';
import { classNames } from '@/shared/utils/classNames';
import styles from './AdminSidebar.module.scss';

interface NavItem {
    label: string;
    path?: string;
    matchPrefix?: string;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Заявки',
        path: '/admin/moderation',
        matchPrefix: '/admin/moderation',
    },
    {
        label: 'Пользователи',
        path: '/admin/users',
        matchPrefix: '/admin/users',
    },
    { label: 'Карта', path: '/' },
];

export const AdminSidebar = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (item: NavItem) => {
        if (!item.path) return;
        navigate(item.path);
    };

    const isActive = (item: NavItem): boolean => {
        if (!item.path) return false;

        if (item.matchPrefix) {
            return location.pathname.startsWith(item.matchPrefix);
        }

        return location.pathname === item.path;
    };

    return (
        <aside className={styles['admin-sidebar']}>
            <h2 className={styles['admin-sidebar__title']}>Админ-панель</h2>

            {authStore.user && (
                <p className={styles['admin-sidebar__user']}>
                    {authStore.user.email}
                </p>
            )}

            <nav className={styles['admin-sidebar__nav']}>
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        type='button'
                        onClick={() => handleNavClick(item)}
                        disabled={!item.path}
                        className={classNames(
                            styles['admin-sidebar__nav-item'],
                            isActive(item)
                                ? styles['admin-sidebar__nav-item--active']
                                : '',
                            !item.path
                                ? styles['admin-sidebar__nav-item--disabled']
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
