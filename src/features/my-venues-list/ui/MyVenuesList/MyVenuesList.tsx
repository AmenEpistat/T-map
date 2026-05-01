import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { venuesStore } from '@/entities/venue';
import { VenueCard } from '../VenueCard/VenueCard';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './MyVenuesList.module.scss';

export const MyVenuesList = observer(() => {
    useEffect(() => {
        void venuesStore.loadAll();
    }, []);

    const { data, isLoading, error } = venuesStore.list;

    return (
        <section className={styles['my-venues-list']}>
            <header className={styles['my-venues-list__header']}>
                <h2 className={styles['my-venues-list__title']}>
                    Мои заведения
                </h2>
                <Button
                    type='primary'
                    size='large'
                    icon={<PlusOutlined />}
                    title='Скоро будет доступно'
                    className={styles['my-venues-list__add-button']}
                >
                    Добавить заведение
                </Button>
            </header>

            <div className={styles['my-venues-list__content']}>
                {isLoading && data === null && (
                    <div className={styles['my-venues-list__loading']}>
                        <Spin size='large' />
                    </div>
                )}

                {error && data === null && (
                    <div className={styles['my-venues-list__error']}>
                        <p className={styles['my-venues-list__error-text']}>
                            Не удалось загрузить заведения
                        </p>
                        <Button
                            type='primary'
                            onClick={() => void venuesStore.loadAll()}
                        >
                            Попробовать снова
                        </Button>
                    </div>
                )}

                {data !== null && data.length === 0 && <EmptyState />}

                {data !== null && data.length > 0 && (
                    <ul className={styles['my-venues-list__items']}>
                        {data.map((venue) => (
                            <li
                                key={venue.id}
                                className={styles['my-venues-list__item']}
                            >
                                <VenueCard venue={venue} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
});
