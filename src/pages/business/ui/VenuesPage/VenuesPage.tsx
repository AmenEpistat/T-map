import { observer } from 'mobx-react-lite';
import styles from './VenuesPage.module.scss';
import { AddVenueForm } from '@/features/venue-create';

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
                <AddVenueForm />
            </section>
        </div>
    );
});
