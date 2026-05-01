import { observer } from 'mobx-react-lite';
import styles from './VenuesPage.module.scss';
import { EmptyState } from '@/features/my-venues-list/ui/EmptyState/EmptyState';

export const VenuesPage = observer(() => {
    return (
        <div className={styles['venues-page']}>
            <header className={styles['venues-page__header']}>
                <h1 className={styles['venues-page__title']}>Заведения</h1>
                <p className={styles['venues-page__subtitle']}>
                    управляйте своими заведениями
                </p>
            </header>

            <section className={styles['venues-page__content']}>
                <EmptyState />
            </section>
        </div>
    );
});
