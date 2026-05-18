import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Modal, Pagination, Spin, message } from 'antd';
import { isAxiosError } from 'axios';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import type { AdminUserModeration } from '@/shared/api/types';
import { SearchOutlined } from '@ant-design/icons';
import { adminUsersStore } from '@/entities/admin-user';
import { AdminUserCard } from '../AdminUserCard/AdminUserCard';
import styles from './AdminUsersList.module.scss';
import { authStore } from '@/features/auth';

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
    const users = data?.items ?? [];
    const totalElements = data?.totalElements ?? 0;

    const handleRetry = (): void => {
        void adminUsersStore.goToPage(adminUsersStore.currentPage);
    };

    const handlePageChange = (page: number): void => {
        void adminUsersStore.goToPage(page - 1);
    };

    const refreshCurrentPage = async (): Promise<void> => {
        await adminUsersStore.goToPage(adminUsersStore.currentPage);
    };

    const handleBlockConflict = async (): Promise<void> => {
        void message.warning(
            'Пользователь уже был заблокирован другим администратором'
        );
        await refreshCurrentPage();
    };

    const handleUnblockConflict = async (): Promise<void> => {
        void message.warning(
            'Пользователь уже был разблокирован другим администратором'
        );
        await refreshCurrentPage();
    };

    const blockUser = async (user: AdminUserModeration): Promise<void> => {
        try {
            await adminUsersStore.block(user.id);
            void message.success('Пользователь заблокирован');
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                await handleBlockConflict();
                return;
            }

            void message.error(
                getErrorMessage('Не удалось заблокировать пользователя', error)
            );
        }
    };

    const unblockUser = async (user: AdminUserModeration): Promise<void> => {
        try {
            await adminUsersStore.unblock(user.id);
            void message.success('Пользователь разблокирован');
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                await handleUnblockConflict();
                return;
            }

            void message.error(
                getErrorMessage('Не удалось разблокировать пользователя', error)
            );
        }
    };

    const handleBlock = (id: string): void => {
        const user = users.find((item) => item.id === id);
        if (!user) return;

        Modal.confirm({
            title: 'Заблокировать пользователя?',
            content: `${user.email} не сможет войти в систему.`,
            okText: 'Заблокировать',
            cancelText: 'Отмена',
            okButtonProps: { danger: true },
            onOk: () => blockUser(user),
        });
    };

    const handleUnblock = (id: string): void => {
        const user = users.find((item) => item.id === id);
        if (!user) return;

        Modal.confirm({
            title: 'Разблокировать пользователя?',
            content: `${user.email} снова сможет войти в систему.`,
            okText: 'Разблокировать',
            cancelText: 'Отмена',
            onOk: () => unblockUser(user),
        });
    };

    const isProtectedUser = (user: AdminUserModeration): boolean =>
        user.id === authStore.user?.userId || user.role === 'ADMIN';

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
                                            onBlock={
                                                isProtectedUser(user)
                                                    ? undefined
                                                    : handleBlock
                                            }
                                            onUnblock={
                                                isProtectedUser(user)
                                                    ? undefined
                                                    : handleUnblock
                                            }
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
