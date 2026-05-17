import { EnvironmentOutlined } from '@ant-design/icons';
import type { AdminVenueModeration } from '@/shared/api/types';
import { VENUE_CATEGORY_OPTIONS } from '@/entities/venue';
import styles from './AdminVenueDetails.module.scss';

interface AdminVenueDetailsProps {
    venue: AdminVenueModeration;
}

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value));

const getCategoryLabel = (category: AdminVenueModeration['category']) =>
    VENUE_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
    category;

export const AdminVenueDetails = ({ venue }: AdminVenueDetailsProps) => {
    const facts = [
        { label: 'Адрес заведения', value: venue.address },
        { label: 'Дата подачи', value: formatDate(venue.createdAt) },
        { label: 'Категория', value: getCategoryLabel(venue.category) },
        { label: 'Владелец', value: venue.ownerEmail },
    ];

    return (
        <section className={styles['admin-venue-details']}>
            <div className={styles['admin-venue-details__photo']}>
                {venue.photoUrl ? (
                    <img
                        src={venue.photoUrl}
                        alt={venue.name}
                        className={styles['admin-venue-details__image']}
                    />
                ) : (
                    <div
                        className={
                            styles['admin-venue-details__photo-placeholder']
                        }
                    >
                        <EnvironmentOutlined
                            className={
                                styles[
                                    'admin-venue-details__photo-placeholder-icon'
                                ]
                            }
                        />
                    </div>
                )}
            </div>

            <div className={styles['admin-venue-details__content']}>
                <h1 className={styles['admin-venue-details__title']}>
                    Информация о заявке
                </h1>

                <h2 className={styles['admin-venue-details__name']}>
                    {venue.name}
                </h2>

                <div className={styles['admin-venue-details__facts']}>
                    {facts.map((fact) => (
                        <p
                            key={fact.label}
                            className={styles['admin-venue-details__fact']}
                        >
                            <span
                                className={
                                    styles['admin-venue-details__fact-label']
                                }
                            >
                                {fact.label}:
                            </span>{' '}
                            {fact.value || '—'}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
};
