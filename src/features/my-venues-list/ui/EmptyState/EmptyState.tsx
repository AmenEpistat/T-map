import styles from './EmptyState.module.scss';

export const EmptyState = () => {
    return (
        <div className={styles['empty-state']}>
            <p className={styles['empty-state__text']}>Список пуст</p>
        </div>
    );
};
