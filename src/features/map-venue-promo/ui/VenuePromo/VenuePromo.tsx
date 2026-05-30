import { observer } from 'mobx-react-lite';
import styles from './VenuePromo.module.scss';
import { useVenuePromo } from '@/features/map-venue-promo/hooks/useVenuePromo.ts';
import VenuePromoItem from '@/features/map-venue-promo/ui/VenuePromoItem/VenuePromoItem.tsx';
import VenuePromoSkeleton from '@/features/map-venue-promo/ui/VenuePromoSkeleton/VenuePromoSkeleton.tsx';
import { VenuePromoQRCode } from '@/features/map-venue-code';

const SKELETON_COUNT = 3;

const VenuePromo = observer(() => {
    const { data, isLoading, loadCode } = useVenuePromo();

    const handleOpenCode = async (ruleId: string) => {
        await loadCode(ruleId);
    };

    return (
        <div className={styles['promo-list']}>
            {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                      <VenuePromoSkeleton key={index} />
                  ))
                : data?.map((item) => (
                      <VenuePromoItem
                          onOpen={handleOpenCode}
                          item={item}
                          key={item.id}
                      />
                  ))}

            <VenuePromoQRCode />
        </div>
    );
});

export default VenuePromo;
