import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import styles from './ZoomControls.module.scss';
import { mapStore } from '@/entities/map';

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
