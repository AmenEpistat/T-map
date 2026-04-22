import { Button, Input } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MapSearch.module.scss';
import { SearchPanel } from '@/features/map/ui/MapSearch/components';

const MapSearch = () => {
    const [isSearchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className={styles['map-search']}>
                <Button
                    className={styles['map-search__button']}
                    onClick={() => navigate('/profile')}
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
        </>
    );
};

export default MapSearch;
