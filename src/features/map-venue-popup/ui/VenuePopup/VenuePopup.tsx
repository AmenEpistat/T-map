import { MapPopup, MapStat } from '@/shared/ui';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';
import { useVenueDetails } from '@/features/map-venue-popup/hooks/useVenueDetails.ts';
import { observer } from 'mobx-react-lite';
import { MAPPING_CATEGORIES } from '@/entities/map';
import styles from './VenuePopup.module.scss';
import { EnvironmentFilled, TikTokOutlined } from '@ant-design/icons';
import PlaceFilled from '@/features/map-venue-popup/ui/Icons/PlaceFilled/PlaceFilled.tsx';
import DishFilled from '@/features/map-venue-popup/ui/Icons/DishFilled/DishFilled.tsx';

const VenuePopup = observer(() => {
    const isMobile = useIsMobile();
    const { closeVenuePopup, data, handleShare, isPopupOpen, isLoading } =
        useVenueDetails();
    const isNotContent = isLoading || !data;

    return (
        <MapPopup
            isOpen={isPopupOpen}
            isMobile={isMobile}
            isLoading={isLoading || !data}
            onClose={closeVenuePopup}
            handleShare={handleShare}
            title={data?.name || 'Заведение'}
            imageUrl={data?.photoUrl}
        >
            {!isNotContent && (
                <>
                    <p className={styles['venue-popup__category']}>
                        {MAPPING_CATEGORIES[data.category]}
                    </p>
                    <div className={styles['venue-popup__description']}>
                        <PlaceFilled />
                        <span>{data.description}</span>
                    </div>

                    <div className={styles['venue-popup__stats']}>
                        {data.music !== null && (
                            <MapStat
                                icon={<TikTokOutlined />}
                                title={'Музыка'}
                                data={`Сегодня играет ${data.music}`}
                            />
                        )}

                        {data.dishOfDay !== null && (
                            <MapStat
                                icon={<DishFilled />}
                                title={'Предложение'}
                                data={`${data.dishOfDay}`}
                            />
                        )}

                        {data.address !== null && (
                            <MapStat
                                icon={<EnvironmentFilled />}
                                title={'Адрес'}
                                data={data.address}
                            />
                        )}
                    </div>
                </>
            )}
        </MapPopup>
    );
});

export default VenuePopup;
