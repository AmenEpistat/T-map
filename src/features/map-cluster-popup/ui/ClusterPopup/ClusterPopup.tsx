import { observer } from 'mobx-react-lite';
import styles from './ClusterPopup.module.scss';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';
import { useClusterDetails } from '@/features/map-cluster-popup/hooks/useClusterDetails.ts';
import { ClusterPopupSkeleton } from '@/features/map-cluster-popup/ui/ClusterPopupSkeleton/ClusterPopupSkeleton.tsx';
import ClusterStat from '@/features/map-cluster-popup/ui/ClusterStat/ClusterStat.tsx';
import { MapPopup } from '@/shared/ui';

export const ClusterPopup = observer(() => {
    const { isPopupOpen, closeClusterPopup, isLoading, data, handleShare } =
        useClusterDetails();
    const isMobile = useIsMobile();
    const isNotContent = isLoading || !data;

    return (
        <MapPopup
            isOpen={isPopupOpen}
            isLoading={isLoading || !data}
            isMobile={isMobile}
            onClose={closeClusterPopup}
            handleShare={handleShare}
            title={`${data?.districtName} район`}
            imageUrl={data?.districtImageUrl}
            skeleton={<ClusterPopupSkeleton />}
        >
            {!isNotContent && (
                <div className={styles['cluster-popup__stats']}>
                    <ClusterStat name={'Транзакций'} count={data.txCount} />
                    <ClusterStat
                        isMoney
                        name={'Средний чек'}
                        count={data.avgCheck}
                    />
                    <ClusterStat
                        isMoney
                        name={'Сумма'}
                        count={data.sumAmount}
                    />
                </div>
            )}
        </MapPopup>
    );
});
