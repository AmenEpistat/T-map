import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { moderationStore } from '@/entities/admin-venue';
import { AdminVenueCard } from '../AdminVenueCard/AdminVenueCard';
import styles from './ModerationQueueList.module.scss';

export const ModerationQueueList = observer(() => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        void moderationStore.loadQueue();
    }, []);

    const { data, isLoading, error } = moderationStore.queue;
    const normalizedQuery = query.trim().toLowerCase();

    const filteredVenues = useMemo(() => {
        if (data === null) {
            return [];
        }

        if (!normalizedQuery) {
            return data;
        }

        return data.filter((venue) => {
            const name = venue.name.toLowerCase();
            const address = venue.address.toLowerCase();

            return (
                name.includes(normalizedQuery) ||
                address.includes(normalizedQuery)
            );
        });
    }, [data, normalizedQuery]);

    const hasSearchResults = filteredVenues.length > 0;
    const isEmptyQueue = data !== null && data.length === 0;
    const isEmptySearch =
        data !== null && data.length > 0 && filteredVenues.length === 0;

    return (
        <section className={styles['moderation-queue-list']}>
            <Input
                size='large'
                placeholder='Поиск заявки'
                value={query}
                prefix={<SearchOutlined />}
                onChange={(event) => setQuery(event.target.value)}
                className={styles['moderation-queue-list__search']}
            />

            <div className={styles['moderation-queue-list__content']}>
                {isLoading && data === null && (
                    <div className={styles['moderation-queue-list__loading']}>
                        <Spin size='large' />
                    </div>
                )}

                {error && data === null && (
                    <div className={styles['moderation-queue-list__error']}>
                        <p
                            className={
                                styles['moderation-queue-list__error-text']
                            }
                        >
                            Не удалось загрузить заявки
                        </p>
                        <Button
                            type='default'
                            onClick={() => void moderationStore.loadQueue()}
                        >
                            Попробовать снова
                        </Button>
                    </div>
                )}

                {isEmptyQueue && (
                    <p className={styles['moderation-queue-list__empty']}>
                        Очередь модерации пуста — всё проверено
                    </p>
                )}

                {isEmptySearch && (
                    <p className={styles['moderation-queue-list__empty']}>
                        По запросу {query.trim()} ничего не найдено
                    </p>
                )}

                {hasSearchResults && (
                    <ul className={styles['moderation-queue-list__items']}>
                        {filteredVenues.map((venue) => (
                            <li
                                key={venue.id}
                                className={
                                    styles['moderation-queue-list__item']
                                }
                            >
                                <AdminVenueCard venue={venue} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
});
