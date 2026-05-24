import { Button, Input } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styles from './MapPanel.module.scss';
import { SearchPanel } from '@/features/map-search';
import { ProfilePanel } from '@/features/profile-panel';
import { useMapPanel } from '@/widgets/map-panel/hooks/useMapPanel.ts';

const MapPanel = () => {
    const {
        setSearchOpen,
        isSearchOpen,
        isPanelOpen,
        handleCloseProfile,
        handleOpenProfile,
    } = useMapPanel();

    return (
        <>
            <div className={styles['map-search']}>
                <Button
                    className={styles['map-search__button']}
                    onClick={handleOpenProfile}
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
            <ProfilePanel isOpen={isPanelOpen} onClose={handleCloseProfile} />
        </>
    );
};

export default MapPanel;
