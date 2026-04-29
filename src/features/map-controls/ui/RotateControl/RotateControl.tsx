import styles from './RotateControl.module.scss';
import { observer } from 'mobx-react-lite';
import { classNames } from '@/shared/utils/classNames.ts';
import { mapStore } from '@/entities/map';

const RotateControl = observer(() => {
    const toggle3D = () => {
        const newPitch = mapStore.viewState.pitch === 0 ? 90 : 0;
        mapStore.setPitch(newPitch);
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
