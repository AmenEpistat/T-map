import { LoginForm } from '@/features/auth/ui';
import styles from './AuthPage.module.scss';

export const AuthPage = () => {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Авторизация</h1>
                <LoginForm />
            </div>
        </main>
    );
};
