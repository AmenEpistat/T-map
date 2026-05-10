import styles from './MapPopupImage.module.scss';
import { DEFAULT_IMAGE_URL } from '@/shared/model/constants.ts';

interface Props {
    src?: string | null;
    alt: string;
}

const MapPopupImage = ({ src, alt }: Props) => {
    return (
        <div className={styles['popup-image']}>
            <img
                width='100%'
                height='auto'
                src={src || DEFAULT_IMAGE_URL}
                alt={alt}
                onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE_URL;
                }}
            />
        </div>
    );
};

export default MapPopupImage;
