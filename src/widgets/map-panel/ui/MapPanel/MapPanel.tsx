import { Button, Input } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './MapPanel.module.scss';
import { SearchPanel } from '@/features/map-search';
import { ProfilePanel } from '@/features/profile-panel';

const MapPanel = () => {
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isPanelOpen, setPanelOpen] = useState(false);

    return (
        <>
            <div className={styles['map-search']}>
                <Button
                    className={styles['map-search__button']}
                    onClick={() => setPanelOpen(true)}
                >
                    <MenuOutlined />
                </Button>
                <Input
                    className={styles['map-search__input']}
                    placeholder='Поиск и выбор мест'
                    readOnly
                    onFocus={() => setSearchOpen(true)}
                    onClick={() => setSearchOpen(true)}
                />
            </div>

            <SearchPanel
                isOpen={isSearchOpen}
                onClose={() => setSearchOpen(false)}
            />
            <ProfilePanel
                isOpen={isPanelOpen}
                onClose={() => setPanelOpen(false)}
            />
        </>
    );
};

export default MapPanel;
