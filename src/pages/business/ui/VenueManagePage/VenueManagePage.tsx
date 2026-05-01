import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { Button, Spin, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    venuesStore,
    VENUE_STATUS_LABELS,
    VENUE_STATUS_COLORS,
} from '@/entities/venue';
import styles from './VenueManagePage.module.scss';

export const VenueManagePage = observer(() => {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        void venuesStore.loadById(id);
    }, [id]);

    const { data, isLoading, error } = venuesStore.current;
    const isCurrentVenueLoaded = data?.id === id;

    if (!id) {
        return (
            <div className={styles['venue-manage']}>
                <p className={styles['venue-manage__error']}>
                    Некорректный URL.
                </p>
            </div>
        );
    }

    if (isLoading || !isCurrentVenueLoaded) {
        if (error) {
            return (
                <div className={styles['venue-manage']}>
                    <p className={styles['venue-manage__error']}>
                        Заведение не найдено или произошла ошибка.
                    </p>
                    <Link to='/business'>
                        <Button type='default' icon={<ArrowLeftOutlined />}>
                            К списку заведений
                        </Button>
                    </Link>
                </div>
            );
        }

        return (
            <div className={styles['venue-manage__loading']}>
                <Spin size='large' />
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className={styles['venue-manage']}>
            <Link to='/business' className={styles['venue-manage__back']}>
                <ArrowLeftOutlined /> К списку заведений
            </Link>

            <header className={styles['venue-manage__header']}>
                <h1 className={styles['venue-manage__title']}>{data.name}</h1>
                <Tag
                    style={{ width: 'fit-content' }}
                    color={VENUE_STATUS_COLORS[data.moderationStatus]}
                >
                    {VENUE_STATUS_LABELS[data.moderationStatus]}
                </Tag>
            </header>

            <p className={styles['venue-manage__address']}>{data.address}</p>

            <section className={styles['venue-manage__placeholder']}>
                <p>Управление заведением</p>
            </section>
        </div>
    );
});
