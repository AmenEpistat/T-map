import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { authStore } from '@/features/auth';
import { LoginForm, RegisterForm } from '@/features/auth/ui';
import styles from './AuthPage.module.scss';

type AuthPageProps = {
    mode: 'login' | 'register';
};

export const AuthPage = observer(({ mode }: AuthPageProps) => {
    if (authStore.isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    {mode === 'login' ? 'Авторизация' : 'Регистрация'}
                </h1>
                {mode === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
        </main>
    );
});
