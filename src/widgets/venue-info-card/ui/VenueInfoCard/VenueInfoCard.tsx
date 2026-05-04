import { useLocation, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { EnvironmentOutlined, CameraOutlined } from '@ant-design/icons';
import type { OwnerVenue } from '@/entities/venue';
import { classNames } from '@/shared/utils/classNames';
import styles from './VenueInfoCard.module.scss';

interface VenueInfoCardProps {
    venue: OwnerVenue;
}

const COMING_SOON = 'Скоро будет доступно';

export const VenueInfoCard = ({ venue }: VenueInfoCardProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isEditing = location.pathname.endsWith('/edit');

    const handleComingSoon = () => {
        void message.info(COMING_SOON);
    };

    const handleEdit = () => {
        navigate(`/business/${venue.id}/edit`);
    };

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
                    onClick={handleComingSoon}
                >
                    <CameraOutlined />
                </button>
            </div>

            <div className={styles['venue-info-card__buttons']}>
                <Button
                    type='primary'
                    size='large'
                    className={styles['venue-info-card__button']}
                    onClick={handleComingSoon}
                >
                    Статистика
                </Button>
                <Button
                    type='primary'
                    size='large'
                    className={styles['venue-info-card__button']}
                    onClick={handleComingSoon}
                >
                    QR-скан
                </Button>
            </div>

            <div className={styles['venue-info-card__links']}>
                <button
                    type='button'
                    className={classNames(
                        styles['venue-info-card__link'],
                        isEditing
                            ? styles['venue-info-card__link--disabled']
                            : ''
                    )}
                    onClick={isEditing ? undefined : handleEdit}
                    disabled={isEditing}
                >
                    Редактирование информации о заведении
                </button>
                <button
                    type='button'
                    className={styles['venue-info-card__link']}
                    onClick={handleComingSoon}
                >
                    Настройка программы лояльности
                </button>
            </div>
        </section>
    );
};
