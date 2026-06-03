import { Dropdown, Tag } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { AdminUserModeration } from '@/shared/api/types';
import styles from './AdminUserCard.module.scss';

interface AdminUserCardProps {
    user: AdminUserModeration;
    onBlock?: (id: string) => void;
    onUnblock?: (id: string) => void;
    onChangeRole?: (id: string) => void;
}

const formatDate = (value: string): string =>
    new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));

export const AdminUserCard = ({
    user,
    onBlock,
    onUnblock,
    onChangeRole,
}: AdminUserCardProps) => {
    const canShowActions = user.blocked
        ? Boolean(onUnblock)
        : Boolean(onBlock) || Boolean(onChangeRole);

    const menuItems: MenuProps['items'] = user.blocked
        ? [
              {
                  key: 'unblock',
                  label: 'Разблокировать',
                  onClick: () => onUnblock?.(user.id),
              },
          ]
        : ([
              onChangeRole &&
                  user.role === 'USER' && {
                      key: 'promote',
                      label: 'Назначить владельцем бизнеса',
                      onClick: () => onChangeRole(user.id),
                  },
              onChangeRole &&
                  user.role === 'BUSINESS_OWNER' && {
                      key: 'demote',
                      label: 'Снять роль владельца',
                      onClick: () => onChangeRole(user.id),
                  },
              onBlock && {
                  key: 'block',
                  label: (
                      <span className={styles['admin-user-card__danger']}>
                          Заблокировать
                      </span>
                  ),
                  onClick: () => onBlock(user.id),
              },
          ].filter(Boolean) as MenuProps['items']);

    return (
        <article className={styles['admin-user-card']}>
            <div className={styles['admin-user-card__main']}>
                <h3 className={styles['admin-user-card__nickname']}>
                    {user.nickname}
                </h3>

                <p className={styles['admin-user-card__email']}>
                    {user.email} {user.role === 'USER' && ' - Пользователь'}
                    {user.role === 'BUSINESS_OWNER' && ' - Владелец бизнеса'}
                    {user.role === 'ADMIN' && ' - Администратор'}
                </p>

                <p className={styles['admin-user-card__date']}>
                    Зарегистрирован {formatDate(user.createdAt)}
                </p>

                <Tag
                    color={user.blocked ? 'red' : 'green'}
                    className={styles['admin-user-card__status']}
                >
                    {user.blocked ? 'Заблокирован' : 'Активен'}
                </Tag>
            </div>

            {canShowActions && (
                <Dropdown
                    trigger={['click']}
                    menu={{ items: menuItems }}
                    placement='bottomRight'
                >
                    <button
                        type='button'
                        className={styles['admin-user-card__menu']}
                        aria-label={`Действия пользователя ${user.email}`}
                    >
                        <MoreOutlined />
                    </button>
                </Dropdown>
            )}
        </article>
    );
};
