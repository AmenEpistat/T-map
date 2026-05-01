import { Link } from 'react-router-dom';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { OwnerVenue } from '@/entities/venue';
import { Tag } from 'antd';
import { VENUE_STATUS_LABELS, VENUE_STATUS_COLORS } from '@/entities/venue';
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
                <Tag
                    style={{ width: 'fit-content' }}
                    color={VENUE_STATUS_COLORS[venue.moderationStatus]}
                >
                    {VENUE_STATUS_LABELS[venue.moderationStatus]}
                </Tag>
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
