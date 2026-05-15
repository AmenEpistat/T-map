import styles from './AdminModerationPage.module.scss';

export const AdminModerationPage = () => {
    return (
        <section className={styles['admin-moderation-page']}>
            <h1 className={styles['admin-moderation-page__title']}>Заявки</h1>
            <p className={styles['admin-moderation-page__stub']}>
                Скоро будет доступно
            </p>
        </section>
    );
};
