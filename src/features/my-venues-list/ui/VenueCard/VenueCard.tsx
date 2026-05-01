import { Link } from 'react-router-dom';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { OwnerVenue } from '@/entities/venue';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './VenueCard.module.scss';

interface VenueCardProps {
    venue: OwnerVenue;
}

export const VenueCard = ({ venue }: VenueCardProps) => {
    return (
        <Link
            to={`/business/${venue.id}`}
            className={styles['venue-card']}
            aria-label={`Открыть управление заведением ${venue.name}`}
        >
            <div className={styles['venue-card__info']}>
                <h3 className={styles['venue-card__name']}>{venue.name}</h3>
                <StatusBadge status={venue.moderationStatus} />
            </div>

            <div className={styles['venue-card__photo']}>
                {venue.photoUrl ? (
                    <img
                        src={venue.photoUrl}
                        alt={venue.name}
                        className={styles['venue-card__image']}
                    />
                ) : (
                    <div className={styles['venue-card__photo-placeholder']}>
                        <EnvironmentOutlined
                            className={
                                styles['venue-card__photo-placeholder-icon']
                            }
                        />
                    </div>
                )}
            </div>
        </Link>
    );
};
