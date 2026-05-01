import styles from './RotateControl.module.scss';
import { observer } from 'mobx-react-lite';
import { classNames } from '@/shared/utils/classNames.ts';
import { mapStore } from '@/entities/map';
import { PITCH_2D, PITCH_3D } from '@/features/map-controls/model/constants.ts';

const RotateControl = observer(() => {
    const toggle3D = () => {
        mapStore.setPitch(mapStore.mode3D ? PITCH_3D : PITCH_2D);
    };

    return (
        <div className={styles['rotate-control']}>
            <div className={styles['rotate-control__circle']} />
            <button
                className={classNames(
                    styles['rotate-control__btn'],
                    mapStore.mode3D
                        ? styles['rotate-control__btn--3d']
                        : styles['rotate-control__btn--2d']
                )}
                onClick={() => {
                    toggle3D();
                }}
            >
                {mapStore.mode3D ? '3D' : '2D'}
            </button>
        </div>
    );
});

export default RotateControl;
