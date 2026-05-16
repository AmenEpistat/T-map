import styles from './ProfileHistory.module.scss';
import { useLoyaltyHistory } from '@/features/profile-history/hooks/useLoyaltyHistory.ts';
import { Pagination } from 'antd';
import { observer } from 'mobx-react-lite';
import ProfileHistoryItem from '@/features/profile-history/ui/ProfileHistoryItem/ProfileHistoryItem.tsx';
import ProfileHistorySkeleton from '@/features/profile-history/ui/ProfileHistorySkeleton/ProfileHistorySkeleton.tsx';

const ProfileHistory = observer(() => {
    const { data, isLoading, setPage } = useLoyaltyHistory();
    const isNotContent =
        data === null || (data?.items.length === 0 && !isLoading);

    return (
        <div className={styles['history']}>
            <h2 className={styles['history__title']}>Моя история</h2>
            {isLoading && <ProfileHistorySkeleton />}

            {isNotContent ? (
                <div className={styles['history__body']}>
                    <span>Упс, здесь пусто</span>
                </div>
            ) : (
                <>
                    <div className={styles['history__list']}>
                        {data?.items.map((item) => (
                            <ProfileHistoryItem key={item.id} item={item} />
                        ))}
                    </div>
                    {data?.totalPages > 1 && (
                        <Pagination
                            total={data?.totalElements}
                            onChange={setPage}
                            showSizeChanger={false}
                        />
                    )}
                </>
            )}
        </div>
    );
});

export default ProfileHistory;
