import { FilterButtons } from '@/features/map/components/LayerFilter/components/FilterButtons/FilterButtons.tsx';
import styles from './LayerFilterDesktop.module.scss';

export const LayerFilterDesktop = () => {
    return (
        <div className={styles['layer-filter']}>
            <FilterButtons vertical={false} />
        </div>
    );
};
