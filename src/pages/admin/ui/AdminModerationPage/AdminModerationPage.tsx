import { Outlet, useParams } from 'react-router-dom';
import { classNames } from '@/shared/utils/classNames';
import styles from './AdminModerationPage.module.scss';
import { ModerationQueueList } from '@/features/moderation-queue';

export const AdminModerationPage = () => {
    const { id } = useParams();
    const hasSelectedVenue = Boolean(id);

    return (
        <section className={styles['admin-moderation-page']}>
            <header
                className={classNames(
                    styles['admin-moderation-page__header'],
                    hasSelectedVenue &&
                        styles[
                            'admin-moderation-page__header--hidden-on-mobile'
                        ]
                )}
            >
                <h1 className={styles['admin-moderation-page__title']}>
                    Заявки
                </h1>
            </header>

            <div className={styles['admin-moderation-page__columns']}>
                <div
                    className={classNames(
                        styles['admin-moderation-page__queue'],
                        hasSelectedVenue &&
                            styles[
                                'admin-moderation-page__queue--hidden-on-mobile'
                            ]
                    )}
                >
                    <ModerationQueueList />
                </div>

                <div
                    className={classNames(
                        styles['admin-moderation-page__details'],
                        !hasSelectedVenue &&
                            styles[
                                'admin-moderation-page__details--hidden-on-mobile'
                            ]
                    )}
                >
                    <Outlet />
                </div>
            </div>
        </section>
    );
};
