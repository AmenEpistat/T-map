import { Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import type { AdminVenueModeration } from '@/shared/api/types';
import { classNames } from '@/shared/utils/classNames';
import styles from './AdminVenueCard.module.scss';
import { VENUE_STATUS_COLORS, VENUE_STATUS_LABELS } from '@/entities/venue';

interface AdminVenueCardProps {
    venue: AdminVenueModeration;
}

export const AdminVenueCard = ({ venue }: AdminVenueCardProps) => {
    const { id } = useParams();
    const isActive = id === venue.id;

    return (
        <Link
            to={`/admin/moderation/${venue.id}`}
            className={classNames(
                styles['admin-venue-card'],
                isActive && styles['admin-venue-card--active']
            )}
            aria-label={`Открыть заявку ${venue.name}`}
        >
            <div className={styles['admin-venue-card__info']}>
                <h3 className={styles['admin-venue-card__name']}>
                    {venue.name}
                </h3>

                <Tag
                    color={VENUE_STATUS_COLORS[venue.moderationStatus]}
                    style={{ width: 'fit-content' }}
                >
                    {VENUE_STATUS_LABELS[venue.moderationStatus]}
                </Tag>
            </div>

            <div className={styles['admin-venue-card__photo']}>
                {venue.photoUrl ? (
                    <img
                        src={venue.photoUrl}
                        alt={venue.name}
                        className={styles['admin-venue-card__image']}
                    />
                ) : (
                    <div
                        className={
                            styles['admin-venue-card__photo-placeholder']
                        }
                    >
                        <EnvironmentOutlined
                            className={
                                styles[
                                    'admin-venue-card__photo-placeholder-icon'
                                ]
                            }
                        />
                    </div>
                )}
            </div>
        </Link>
    );
};
