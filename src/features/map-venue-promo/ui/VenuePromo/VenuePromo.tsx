import { observer } from 'mobx-react-lite';
import styles from './VenuePromo.module.scss';
import { useVenuePromo } from '@/features/map-venue-promo/hooks/useVenuePromo.ts';
import VenuePromoItem from '@/features/map-venue-promo/ui/VenuePromoItem/VenuePromoItem.tsx';
import VenuePromoSkeleton from '@/features/map-venue-promo/ui/VenuePromoSkeleton/VenuePromoSkeleton.tsx';

const SKELETON_COUNT = 3;

const VenuePromo = observer(() => {
    const { data, isLoading } = useVenuePromo();

    return (
        <div className={styles['promo-list']}>
            {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                      <VenuePromoSkeleton key={index} />
                  ))
                : data?.map((item) => (
                      <VenuePromoItem item={item} key={item.id} />
                  ))}
        </div>
    );
});

export default VenuePromo;
