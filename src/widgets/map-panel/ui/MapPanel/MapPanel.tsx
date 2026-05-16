import { Button, Input } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import styles from './MapPanel.module.scss';
import { SearchPanel } from '@/features/map-search';
import { ProfilePanel } from '@/features/profile-panel';
import { useSearchParams } from 'react-router-dom';

const MapPanel = () => {
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has('venue')) {
            setPanelOpen(false);
        }
    }, [searchParams]);

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
