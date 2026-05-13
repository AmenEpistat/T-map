import styles from './ProfileAuthHeader.module.scss';
import CloseButton from '@/shared/ui/CloseButton/CloseButton.tsx';
import { Button, Dropdown, type MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/features/auth';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Props {
    onClose: () => void;
    isMobile: boolean;
}

const ProfileAuthHeader = observer(({ onClose, isMobile }: Props) => {
    const navigate = useNavigate();
    const user = authStore.user!;

    const items = [
        {
            key: '1',
            label: <Button type={'text'}>Сменить пароль</Button>,
        },
        user?.role === 'BUSINESS_OWNER' && {
            key: '3',
            label: (
                <Button onClick={() => navigate('/business')} type={'text'}>
                    Мои заведения
                </Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button onClick={() => authStore.logout()} type={'text'} danger>
                    Выйти
                </Button>
            ),
        },
    ].filter(Boolean) as MenuProps['items'];

    return (
        <div className={styles['profile-auth']}>
            <div className={styles['profile-auth__header']}>
                {isMobile ? (
                    <Dropdown trigger={['click']} menu={{ items }}>
                        <div className={styles['profile-auth__avatar']}>
                            <div
                                className={styles['profile-auth__avatar-icon']}
                            />
                            <Button
                                className={styles['profile-auth__name-btn']}
                                type={'text'}
                            >
                                <p className={styles['profile-auth__name']}>
                                    <span>
                                        {user.nickname}
                                        <DownOutlined />
                                    </span>
                                    <span
                                        className={
                                            styles['profile-auth__email']
                                        }
                                    >
                                        {' '}
                                        {user.email}
                                    </span>
                                </p>
                            </Button>
                        </div>
                    </Dropdown>
                ) : (
                    <>
                        <div className={styles['profile-auth__avatar']}>
                            <div
                                className={styles['profile-auth__avatar-icon']}
                            />
                            <p className={styles['profile-auth__name']}>
                                {user.nickname}
                                <span className={styles['profile-auth__email']}>
                                    {user.email}
                                </span>
                            </p>
                        </div>
                        <Dropdown trigger={['click']} menu={{ items }}>
                            <Button type={'text'}>
                                <EllipsisOutlined
                                    className={
                                        styles['profile-auth__menu-icon']
                                    }
                                />
                            </Button>
                        </Dropdown>
                    </>
                )}

                <CloseButton onClose={onClose} isMobile={isMobile} />
            </div>
        </div>
    );
});

export default ProfileAuthHeader;
