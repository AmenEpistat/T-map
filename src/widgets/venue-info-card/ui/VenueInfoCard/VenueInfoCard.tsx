import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Popconfirm, message, notification } from 'antd';
import { EnvironmentOutlined, CameraOutlined } from '@ant-design/icons';
import { venuesStore, type OwnerVenue } from '@/entities/venue';
import { PhotoManagerModal } from '@/features/venue-photo-manager';
import { classNames } from '@/shared/utils/classNames';
import styles from './VenueInfoCard.module.scss';

interface VenueInfoCardProps {
    venue: OwnerVenue;
}

const COMING_SOON = 'Скоро будет доступно';

export const VenueInfoCard = ({ venue }: VenueInfoCardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    const isEditing = location.pathname.endsWith('/edit');

    const handleComingSoon = () => {
        void message.info(COMING_SOON);
    };

    const handleEdit = () => {
        navigate(`/business/${venue.id}/edit`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await venuesStore.delete(venue.id);

            notification.success({
                message: 'Заведение удалено',
                placement: 'topRight',
            });

            navigate('/business');
        } catch (error) {
            const description =
                error instanceof Error
                    ? error.message
                    : 'Не удалось удалить заведение';

            notification.error({
                message: 'Ошибка',
                description,
                placement: 'topRight',
            });

            setIsDeleting(false);
        }
    };

    return (
        <section className={styles['venue-info-card']}>
            {venue.moderationStatus === 'REJECTED' && venue.rejectReason && (
                <div className={styles['venue-info-card__reject-reason']}>
                    <span
                        className={
                            styles['venue-info-card__reject-reason-label']
                        }
                    >
                        Причина отказа
                    </span>
                    <p
                        className={
                            styles['venue-info-card__reject-reason-text']
                        }
                    >
                        {venue.rejectReason}
                    </p>
                </div>
            )}
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
                    onClick={() => setIsPhotoModalOpen(true)}
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

                <Popconfirm
                    title='Удалить заведение?'
                    description='Это действие нельзя отменить. Заведение пропадёт с карты и из вашего списка.'
                    onConfirm={handleDelete}
                    okText='Удалить'
                    cancelText='Отмена'
                    okButtonProps={{ danger: true, loading: isDeleting }}
                    placement='right'
                >
                    <button
                        type='button'
                        className={styles['venue-info-card__link']}
                        disabled={isDeleting}
                    >
                        Удаление заведения
                    </button>
                </Popconfirm>
            </div>
            <PhotoManagerModal
                venue={venue}
                open={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
            />
        </section>
    );
};
