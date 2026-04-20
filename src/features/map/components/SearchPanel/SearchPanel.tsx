import { Button, Divider, Input, Spin } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './SearchPanel.module.scss';
import { useSearch } from '@/features/map/hooks/useSearch.ts';
import SearchSuggestion from '@/features/map/components/SearchSuggestion/SearchSuggestion.tsx';
import type { Venue } from '@/entities/venue/model/types.ts';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const SearchPanel = ({ isOpen, onClose }: Props) => {
    const {
        query,
        suggestions,
        loading,
        handleChange,
        handleSelect,
        handleClear,
    } = useSearch(onClose);

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
                                {loading ? (
                                    <Spin size='small' />
                                ) : query ? (
                                    <CloseOutlined onClick={handleClear} />
                                ) : null}
                            </div>
                        }
                        onChange={(e) => handleChange(e.target.value)}
                    />
                    <Button
                        className={styles['search-panel__button']}
                        onClick={onClose}
                        type='text'
                    >
                        Отменить
                    </Button>
                </div>

                <Divider />

                {suggestions.length > 0 && (
                    <ul className={styles['search-panel__list']}>
                        {suggestions.map((venue: Venue) => (
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
};

export default SearchPanel;
