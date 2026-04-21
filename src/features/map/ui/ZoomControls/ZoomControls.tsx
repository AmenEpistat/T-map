import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { mapStore } from '@/features/map/model/mapStore';
import styles from './ZoomControls.module.scss';

const ZoomControls = observer(() => {
    return (
        <div className={styles['zoom-controls']}>
            <Button
                className={styles['zoom-controls__button']}
                onClick={() => mapStore.zoomIn()}
            >
                <PlusOutlined />
            </Button>
            <Button
                className={styles['zoom-controls__button']}
                onClick={() => mapStore.zoomOut()}
            >
                <MinusOutlined />
            </Button>
        </div>
    );
});

export default ZoomControls;
