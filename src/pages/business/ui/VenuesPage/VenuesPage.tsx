import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import styles from './VenuesPage.module.scss';

export const VenuesPage = observer(() => {
    const navigate = useNavigate();

    return (
        <main className={styles['venues-page']}>
            <div className={styles['venues-page__container']}>
                <h1 className={styles['venues-page__title']}>Мои заведения</h1>
                <p className={styles['venues-page__placeholder']}>
                    Список ваших заведений появится здесь.
                </p>
                <Button
                    type='default'
                    size='large'
                    onClick={() => navigate('/profile')}
                    className={styles['venues-page__action']}
                >
                    Назад в профиль
                </Button>
            </div>
        </main>
    );
});
