import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { authStore } from '@/features/auth';
import styles from './ProfilePage.module.scss';

export const ProfilePage = observer(() => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authStore.logout();
        navigate('/auth/login', { replace: true });
    };

    return (
        <main className={styles['profile-page']}>
            <div className={styles['profile-page__container']}>
                <h1 className={styles['profile-page__title']}>Профиль</h1>
                {authStore.user && (
                    <p className={styles['profile-page__info']}>
                        Вы вошли как пользователь{' '}
                        <strong>{authStore.user.userId}</strong>
                    </p>
                )}
                <Button
                    type='primary'
                    size='large'
                    onClick={() => navigate('/business')}
                    className={styles['profile-page__action']}
                >
                    Мои заведения
                </Button>
                <Button
                    type='default'
                    size='large'
                    onClick={() => navigate('/')}
                    className={styles['profile-page__action']}
                >
                    Назад к карте
                </Button>
                <Button
                    type='default'
                    size='large'
                    onClick={handleLogout}
                    className={styles['profile-page__logout']}
                >
                    Выйти из профиля
                </Button>
            </div>
        </main>
    );
});
