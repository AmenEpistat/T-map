import { Button } from 'antd';
import { EnvironmentOutlined, CameraOutlined } from '@ant-design/icons';
import type { OwnerVenue } from '@/entities/venue';
import styles from './VenueInfoCard.module.scss';

interface VenueInfoCardProps {
    venue: OwnerVenue;
}

export const VenueInfoCard = ({ venue }: VenueInfoCardProps) => {
    return (
        <section className={styles['venue-info-card']}>
            <div className={styles['venue-info-card__photo']}>
                {venue.photoUrl ? (
                    <img
                        src={venue.photoUrl}
                        alt={venue.name}
                        className={styles['venue-info-card__photo-image']}
                    />
                ) : (
                    <div
                        className={styles['venue-info-card__photo-placeholder']}
                    >
                        <EnvironmentOutlined
                            className={
                                styles[
                                    'venue-info-card__photo-placeholder-icon'
                                ]
                            }
                        />
                    </div>
                )}
                <button
                    type='button'
                    className={styles['venue-info-card__photo-action']}
                    aria-label='Изменить фото'
                >
                    <CameraOutlined />
                </button>
            </div>

            <div className={styles['venue-info-card__buttons']}>
                <Button
                    type='primary'
                    size='large'
                    className={styles['venue-info-card__button']}
                >
                    Статистика
                </Button>
                <Button
                    type='primary'
                    size='large'
                    className={styles['venue-info-card__button']}
                >
                    QR-скан
                </Button>
            </div>

            <div className={styles['venue-info-card__links']}>
                <button
                    type='button'
                    className={styles['venue-info-card__link']}
                >
                    Редактирование информации о заведении
                </button>
                <button
                    type='button'
                    className={styles['venue-info-card__link']}
                >
                    Настройка программы лояльности
                </button>
            </div>
        </section>
    );
};
