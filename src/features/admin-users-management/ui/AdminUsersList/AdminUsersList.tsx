import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Pagination, Spin, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { adminUsersStore } from '@/entities/admin-user';
import { AdminUserCard } from '../AdminUserCard/AdminUserCard';
import styles from './AdminUsersList.module.scss';

const SEARCH_DEBOUNCE_MS = 400;

export const AdminUsersList = observer(() => {
    const [inputValue, setInputValue] = useState(adminUsersStore.searchQuery);

    useEffect(() => {
        setInputValue('');
        void adminUsersStore.search('');
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (inputValue !== adminUsersStore.searchQuery) {
                void adminUsersStore.search(inputValue);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [inputValue]);

    const { data, isLoading, error } = adminUsersStore.page;

    const handleRetry = (): void => {
        void adminUsersStore.goToPage(adminUsersStore.currentPage);
    };

    const handlePageChange = (page: number): void => {
        void adminUsersStore.goToPage(page - 1);
    };

    const handleBlock = (id: string): void => {
        void message.info(`Блокировка пользователя ${id}`);
    };

    const handleUnblock = (id: string): void => {
        void message.info(`Разблокировка пользователя ${id}`);
    };

    const users = data?.items ?? [];
    const totalElements = data?.totalElements ?? 0;
    const hasUsers = users.length > 0;
    const hasQuery = adminUsersStore.searchQuery.trim().length > 0;
    const isInitialLoading = isLoading && data === null;
    const isOverlayLoading = isLoading && data !== null;
    const isInitialError = Boolean(error) && data === null;
    const isEmpty = data !== null && users.length === 0;

    return (
        <section className={styles['admin-users-list']}>
            <Input
                size='large'
                placeholder='Поиск пользователя'
                value={inputValue}
                prefix={<SearchOutlined />}
                onChange={(event) => setInputValue(event.target.value)}
                className={styles['admin-users-list__search']}
            />

            <div className={styles['admin-users-list__content']}>
                {isInitialLoading && (
                    <div className={styles['admin-users-list__loading']}>
                        <Spin size='large' />
                    </div>
                )}

                {isInitialError && (
                    <div className={styles['admin-users-list__error']}>
                        <p className={styles['admin-users-list__error-text']}>
                            Не удалось загрузить пользователей
                        </p>
                        <Button type='default' onClick={handleRetry}>
                            Попробовать снова
                        </Button>
                    </div>
                )}

                {isEmpty && (
                    <p className={styles['admin-users-list__empty']}>
                        {hasQuery
                            ? `По запросу «${adminUsersStore.searchQuery.trim()}» ничего не найдено`
                            : 'Пока никого нет'}
                    </p>
                )}

                {hasUsers && (
                    <>
                        <div className={styles['admin-users-list__items-wrap']}>
                            <ul className={styles['admin-users-list__items']}>
                                {users.map((user) => (
                                    <li
                                        key={user.id}
                                        className={
                                            styles['admin-users-list__item']
                                        }
                                    >
                                        <AdminUserCard
                                            user={user}
                                            onBlock={handleBlock}
                                            onUnblock={handleUnblock}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {isOverlayLoading && (
                                <div
                                    className={
                                        styles['admin-users-list__overlay']
                                    }
                                >
                                    <Spin />
                                </div>
                            )}
                        </div>

                        <Pagination
                            current={adminUsersStore.currentPage + 1}
                            total={totalElements}
                            pageSize={adminUsersStore.pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            className={styles['admin-users-list__pagination']}
                        />
                    </>
                )}
            </div>
        </section>
    );
});
