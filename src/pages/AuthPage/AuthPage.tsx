import { LoginForm, RegisterForm } from '@/features/auth/ui';
import styles from './AuthPage.module.scss';

type AuthPageProps = {
    mode: 'login' | 'register';
};

export const AuthPage = ({ mode }: AuthPageProps) => {
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
};
