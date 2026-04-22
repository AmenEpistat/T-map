import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { FilterButtons } from '@/features/map-layers/ui/LayerFilter/components/FilterButtons/FilterButtons.tsx';
import styles from './LayerFilterMobile.module.scss';
import { LayerOutlined } from '@/features/map-layers/ui/LayerFilter/components/Icons';

export const LayerFilterMobile = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles['layer-filter']}>
            <Button
                className={styles['layer-filter__button']}
                onClick={() => setOpen(true)}
            >
                <LayerOutlined />
            </Button>
            <Drawer
                title='Слои карты'
                placement='bottom'
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
            >
                <FilterButtons />
            </Drawer>
        </div>
    );
};
