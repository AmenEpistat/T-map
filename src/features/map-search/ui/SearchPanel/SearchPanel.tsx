import { Button, Divider, Input } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './SearchPanel.module.scss';
import { useMapSearch } from '@/features/map-search/hooks/useMapSearch.ts';
import { SearchSuggestion } from '@/features/map-search/ui/SearchSuggestion/SearchSuggestion.tsx';
import type { VenueSearch } from '@/entities/public-venue';
import { observer } from 'mobx-react-lite';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const SearchPanel = observer(({ isOpen, onClose }: Props) => {
    const { query, suggestions, handleChange, handleSelect, handleClear } =
        useMapSearch(onClose);

    if (!isOpen) return null;

    return (
        <div className={styles['search-panel-wrapper']} onClick={onClose}>
            <div
                className={styles['search-panel']}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles['search-panel__header']}>
                    <div className={styles['search-panel__icon-wrapper']}>
                        <SearchOutlined
                            className={styles['search-panel__icon']}
                        />
                    </div>
                    <Input
                        className={styles['search-panel__input']}
                        placeholder='Поиск и выбор мест'
                        value={query}
                        suffix={
                            <div>
                                {query ? (
                                    <CloseOutlined onClick={handleClear} />
                                ) : null}
                            </div>
                        }
                        onChange={(e) => handleChange(e.target.value)}
                    />
                    <Button
                        className={styles['search-panel__button']}
                        onClick={() => {
                            handleClear();
                            onClose();
                        }}
                        type='text'
                    >
                        Отменить
                    </Button>
                </div>

                <Divider className={styles['search-panel__divider']} />

                {suggestions.length > 0 && (
                    <ul className={styles['search-panel__list']}>
                        {suggestions.map((venue: VenueSearch) => (
                            <SearchSuggestion
                                key={venue.id}
                                suggestion={venue}
                                onSelect={handleSelect}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
});
