import { useLayerFilter } from '@/features/map/hooks/useLayerFilter.ts';
import { observer } from 'mobx-react-lite';
import { CATEGORY_UI, LAYER_UI } from '@/features/map/config/categories.tsx';
import type { MapCategory } from '@/entities/map';
import { Button } from 'antd';
import styles from './FilterButtons.module.scss';
import { classNames } from '@/shared/utils/classNames.ts';

export const FilterButtons = observer(
    ({ vertical = true }: { vertical?: boolean }) => {
        const {
            toggleCategory,
            isSelected,
            toggleAnomalies,
            isAnomaliesVisible,
        } = useLayerFilter();

        return (
            <div className={classNames(!vertical && styles['filter-buttons'])}>
                {vertical && (
                    <div className={styles['filter-buttons__divider']} />
                )}
                {Object.entries(CATEGORY_UI).map(([key, config]) => (
                    <Button
                        key={key}
                        type={'text'}
                        className={classNames(
                            styles['filter-buttons__btn'],
                            isSelected(key as MapCategory) &&
                                styles['filter-buttons__btn--active']
                        )}
                        onClick={() => toggleCategory(key as MapCategory)}
                    >
                        {config.icon}
                        {vertical && config.label}
                    </Button>
                ))}
                {vertical && (
                    <div className={styles['filter-buttons__divider']} />
                )}

                <Button
                    className={classNames(
                        styles['filter-buttons__btn'],
                        styles['filter-buttons__btn--anomaly'],
                        isAnomaliesVisible &&
                            styles['filter-buttons__btn--active']
                    )}
                    onClick={toggleAnomalies}
                    type={'text'}
                >
                    {LAYER_UI.anomalies.icon}
                    {vertical && LAYER_UI.anomalies.label}
                </Button>
            </div>
        );
    }
);
