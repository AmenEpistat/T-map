import styles from './ClusterPopupImage.module.scss';
import { defaultDistrictImageUrl } from '@/features/map-cluster-popup/model/constants.ts';

interface Props {
    src: string;
    alt: string;
}

const ClusterPopupImage = ({ src, alt }: Props) => {
    return (
        <div className={styles['popup-image']}>
            <img
                width='100%'
                height='auto'
                src={src || defaultDistrictImageUrl}
                alt={alt}
                onError={(e) => {
                    e.currentTarget.src = defaultDistrictImageUrl;
                }}
            />
        </div>
    );
};

export default ClusterPopupImage;
