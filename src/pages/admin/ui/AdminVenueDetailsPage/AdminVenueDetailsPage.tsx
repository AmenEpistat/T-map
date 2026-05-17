import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { moderationStore } from '@/entities/admin-venue';
import { AdminVenueDetails } from '@/widgets/admin-venue-details';
import styles from './AdminVenueDetailsPage.module.scss';

export const AdminVenueDetailsPage = observer(() => {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        void moderationStore.loadById(id);
    }, [id]);

    const { data, error } = moderationStore.current;
    const isCurrentVenueLoaded = data?.id === id;

    if (!id) {
        return (
            <div className={styles['admin-venue-details-page']}>
                <p className={styles['admin-venue-details-page__error']}>
                    Некорректный URL.
                </p>
            </div>
        );
    }

    if (!isCurrentVenueLoaded) {
        if (error) {
            return (
                <div className={styles['admin-venue-details-page']}>
                    <p className={styles['admin-venue-details-page__error']}>
                        Заявка не найдена или произошла ошибка.
                    </p>
                    <Link to='/admin/moderation'>
                        <Button type='default' icon={<ArrowLeftOutlined />}>
                            К списку заявок
                        </Button>
                    </Link>
                </div>
            );
        }

        return (
            <div className={styles['admin-venue-details-page__loading']}>
                <Spin size='large' />
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className={styles['admin-venue-details-page']}>
            <AdminVenueDetails venue={data} />
        </div>
    );
});
