import { useLayerFilter } from '@/features/map-layers/hooks/useLayerFilter.ts';
import { observer } from 'mobx-react-lite';
import type { MapCategory } from '@/entities/map';
import { Button } from 'antd';
import styles from './FilterButtons.module.scss';
import { classNames } from '@/shared/utils/classNames.ts';
import {
    CATEGORY_UI,
    LAYER_UI,
} from '@/features/map-layers/config/categories.tsx';

export const FilterButtons = observer(
    ({ vertical = true }: { vertical?: boolean }) => {
        const {
            toggleCategory,
            isSelected,
            toggleAnomalies,
            isAnomaliesVisible,
            isTeamVisible,
            toggleTeam,
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

                {vertical && (
                    <div className={styles['filter-buttons__divider']} />
                )}
                <Button
                    className={classNames(
                        styles['filter-buttons__btn'],
                        styles['filter-buttons__btn--team'],
                        isTeamVisible && styles['filter-buttons__btn--active']
                    )}
                    onClick={toggleTeam}
                    type={'text'}
                >
                    {LAYER_UI.team.icon}
                    {vertical && LAYER_UI.team.label}
                </Button>
            </div>
        );
    }
);
