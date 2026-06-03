import styles from './ProfileAuthHeader.module.scss';
import CloseButton from '@/shared/ui/CloseButton/CloseButton.tsx';
import { Button, Dropdown, type MenuProps, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/features/auth';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChangePasswordForm } from '@/features/profile-edit';

interface Props {
    onClose: () => void;
    isMobile: boolean;
}

const ProfileAuthHeader = observer(({ onClose, isMobile }: Props) => {
    const navigate = useNavigate();
    const user = authStore.user!;

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const items = [
        {
            key: '1',
            label: 'Сменить пароль',
            onClick: () => setIsPasswordModalOpen(true),
        },
        user?.role === 'BUSINESS_OWNER' && {
            key: '3',
            label: 'Мои заведения',
            onClick: () => navigate('/business'),
        },
        authStore.isAdmin && {
            key: '4',
            label: 'Админ-панель',
            onClick: () => navigate('/admin'),
        },
        {
            key: '5',
            label: 'Связаться с нами',
            onClick: () => setIsContactModalOpen(true),
        },
        {
            key: '2',
            label: 'Выйти',
            danger: true,
            onClick: () => {
                authStore.logout();
                onClose();
            },
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
                                        {user?.nickname}
                                        <DownOutlined />
                                    </span>
                                    <span
                                        className={
                                            styles['profile-auth__email']
                                        }
                                    >
                                        {' '}
                                        {user?.email}
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
                                {user?.nickname}
                                <span className={styles['profile-auth__email']}>
                                    {user?.email}
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
            <Modal
                title='Смена пароля'
                open={isPasswordModalOpen}
                onCancel={() => setIsPasswordModalOpen(false)}
                footer={null}
                destroyOnHidden
                centered={isMobile}
            >
                <ChangePasswordForm
                    onCancel={() => setIsPasswordModalOpen(false)}
                />
            </Modal>

            <Modal
                title='Связаться с нами'
                open={isContactModalOpen}
                onCancel={() => setIsContactModalOpen(false)}
                footer={null}
                centered={isMobile}
            >
                <p>По всем вопросам пишите нам на почту:</p>
                <a href='mailto:admin@t-map.ru'>admin@t-map.ru</a>
            </Modal>
        </div>
    );
});

export default ProfileAuthHeader;
