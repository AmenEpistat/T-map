import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { Button, Spin, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    venuesStore,
    VENUE_STATUS_LABELS,
    VENUE_STATUS_COLORS,
} from '@/entities/venue';
import { VenueInfoCard } from '@/widgets/venue-info-card';
import { classNames } from '@/shared/utils/classNames';
import styles from './VenueManagePage.module.scss';

export const VenueManagePage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const isEditing = location.pathname.endsWith('/edit');

    useEffect(() => {
        if (!id) return;
        void venuesStore.loadById(id);
    }, [id]);

    const { data, error } = venuesStore.current;
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

    if (!isCurrentVenueLoaded) {
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
            <header className={styles['venue-manage__header']}>
                <Link to='/business' className={styles['venue-manage__back']}>
                    <ArrowLeftOutlined /> К списку заведений
                </Link>

                <div className={styles['venue-manage__title-row']}>
                    <h1 className={styles['venue-manage__title']}>
                        {data.name}
                    </h1>
                    <Tag
                        color={VENUE_STATUS_COLORS[data.moderationStatus]}
                        className={styles['venue-manage__tag']}
                    >
                        {VENUE_STATUS_LABELS[data.moderationStatus]}
                    </Tag>
                </div>

                <p className={styles['venue-manage__address']}>
                    {data.address}
                </p>
            </header>

            <div className={styles['venue-manage__columns']}>
                <div
                    className={classNames(
                        styles['venue-manage__info'],
                        isEditing
                            ? styles['venue-manage__info--hidden-on-mobile']
                            : ''
                    )}
                >
                    <VenueInfoCard venue={data} />
                </div>
                <div
                    className={classNames(
                        styles['venue-manage__form'],
                        !isEditing
                            ? styles['venue-manage__form--hidden-on-mobile']
                            : ''
                    )}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
});
