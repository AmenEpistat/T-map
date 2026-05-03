import { useState } from 'react';
import { AutoComplete } from 'antd';
import { useAddressSearch } from '../../model/useAddressSearch';
import type { AddressSuggestion } from '../../api/nominatimApi';
import styles from './AddressPicker.module.scss';

interface AddressPickerProps {
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (suggestion: AddressSuggestion) => void;
    placeholder?: string;
    size?: 'large' | 'middle' | 'small';
    disabled?: boolean;
}

interface AutoCompleteOption {
    value: string;
    suggestion: AddressSuggestion;
    key: string;
}

export const AddressPicker = ({
    value,
    onChange,
    onSelect,
    placeholder = 'Введите адрес',
    size = 'large',
    disabled = false,
}: AddressPickerProps) => {
    const [query, setQuery] = useState(value ?? '');
    const { suggestions, isLoading, error } = useAddressSearch(query);

    const options: AutoCompleteOption[] = suggestions.map((suggestion) => ({
        value: suggestion.address,
        suggestion,
        key: suggestion.id,
    }));

    const handleChange = (text: string) => {
        setQuery(text);
        onChange?.(text);
    };

    const handleSelect = (_: string, option: AutoCompleteOption) => {
        onSelect?.(option.suggestion);
    };

    const notFoundContent = isLoading ? (
        'Поиск...'
    ) : error ? (
        <span className={styles['address-picker__error']}>{error}</span>
    ) : query.trim().length >= 4 ? (
        'Не найдено. Попробуйте уточнить адрес (улица и номер дома)'
    ) : null;

    return (
        <AutoComplete
            value={value}
            options={options}
            onChange={handleChange}
            onSelect={handleSelect}
            notFoundContent={notFoundContent}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
            allowClear
            className={styles['address-picker']}
        />
    );
};
