import { observer } from 'mobx-react-lite';
import { Button, Drawer } from 'antd';
import styles from './ClusterPopup.module.scss';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';
import { useClusterDetails } from '@/features/map-cluster-popup/hooks/useClusterDetails.ts';
import { ClusterPopupSkeleton } from '@/features/map-cluster-popup/ui/ClusterPopupSkeleton/ClusterPopupSkeleton.tsx';
import ClusterPopupImage from '@/features/map-cluster-popup/ui/ClusterPopupImage/ClusterPopupImage.tsx';
import ClusterStat from '@/features/map-cluster-popup/ui/ClusterStat/ClusterStat.tsx';
import CloseFilled from '@/features/map-cluster-popup/ui/Icons/CloseFilled/CloseFilled.tsx';
import { CaretLeftFilled, EnvironmentFilled } from '@ant-design/icons';
import { classNames } from '@/shared/utils/classNames.ts';
import { SharedFilled, SharedOutlined } from '@/shared/ui';

export const ClusterPopup = observer(() => {
    const { isPopupOpen, closeClusterPopup, isLoading, data, handleShare } =
        useClusterDetails();
    const isMobile = useIsMobile();
    const isNotContent = isLoading || !data;

    return (
        <Drawer
            open={isPopupOpen}
            placement={isMobile ? 'bottom' : 'left'}
            className={classNames(styles['cluster-popup'])}
            closable={false}
            mask={isMobile}
        >
            {isNotContent ? (
                <ClusterPopupSkeleton />
            ) : (
                <>
                    <ClusterPopupImage
                        src={data.districtImageUrl}
                        alt={data.districtName}
                    />
                    {isMobile && (
                        <Button
                            className={styles['cluster-popup__map-btn']}
                            type={'text'}
                            onClick={closeClusterPopup}
                        >
                            <EnvironmentFilled
                                className={
                                    styles['cluster-popup__map-btn-icon']
                                }
                            />
                        </Button>
                    )}
                    <div className={styles['cluster-popup__content']}>
                        <div className={styles['cluster-popup__header']}>
                            <h2 className={styles['cluster-popup__district']}>
                                {data.districtName} район
                            </h2>
                            <Button
                                type='text'
                                onClick={handleShare}
                                className={classNames(
                                    !isMobile && styles['cluster-popup__share']
                                )}
                            >
                                {isMobile ? (
                                    <SharedFilled />
                                ) : (
                                    <SharedOutlined />
                                )}
                            </Button>
                            <Button
                                type={'text'}
                                className={styles['cluster-popup__close-btn']}
                                onClick={closeClusterPopup}
                            >
                                {isMobile ? (
                                    <CloseFilled />
                                ) : (
                                    <CaretLeftFilled />
                                )}
                            </Button>
                        </div>

                        <div className={styles['cluster-popup__stats']}>
                            <ClusterStat
                                name={'Транзакций'}
                                count={data.txCount}
                            />
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
                    </div>
                </>
            )}
        </Drawer>
    );
});
