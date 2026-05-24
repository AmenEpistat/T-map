import { observer } from 'mobx-react-lite';
import styles from './ClusterPopup.module.scss';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';
import { useClusterDetails } from '@/features/map-cluster-popup/hooks/useClusterDetails.ts';
import { ClusterPopupSkeleton } from '@/features/map-cluster-popup/ui/ClusterPopupSkeleton/ClusterPopupSkeleton.tsx';
import ClusterStat from '@/features/map-cluster-popup/ui/ClusterStat/ClusterStat.tsx';
import { MapPopup } from '@/shared/ui';
import ClusterAnomalyBlock from '@/features/map-cluster-popup/ui/ClusterAnomalyBlock/ClusterAnomalyBlock.tsx';

export const ClusterPopup = observer(() => {
    const {
        isPopupOpen,
        closeClusterPopup,
        isLoading,
        data,
        handleShare,
        isAnomaliesVisible,
    } = useClusterDetails();
    const isMobile = useIsMobile();
    const isNotContent = isLoading || !data;

    return (
        <MapPopup
            isOpen={isPopupOpen}
            isLoading={isLoading}
            isMobile={isMobile}
            onClose={closeClusterPopup}
            handleShare={handleShare}
            title={
                data?.districtName
                    ? `${data?.districtName} район`
                    : 'Тут должно было быть название района, но что-то пошло не так :('
            }
            imageUrl={data?.districtImageUrl}
            skeleton={<ClusterPopupSkeleton />}
        >
            {!isNotContent && (
                <>
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
                    {isAnomaliesVisible && (
                        <>
                            <div className={styles['cluster-popup__divider']} />
                            <ClusterAnomalyBlock
                                isAnomaly={data.isAnomaly}
                                ratio={data.anomalyRatio}
                                baseline={data.baselineAvg}
                            />
                        </>
                    )}
                </>
            )}
        </MapPopup>
    );
});
