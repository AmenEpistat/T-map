import { EnvironmentOutlined } from '@ant-design/icons';
import styles from './SearchSuggestion.module.scss';
import { Button } from 'antd';
import type { Venue } from '@/entities/venue/model/types.ts';

type Props = {
    suggestion: Venue;
    onSelect: (v: Venue) => void;
};

export const SearchSuggestion = ({ suggestion, onSelect }: Props) => {
    if (!suggestion || !suggestion.name) {
        return null;
    }

    return (
        <li>
            <Button
                className={styles['suggestion']}
                onClick={() => onSelect(suggestion)}
                type='text'
            >
                <EnvironmentOutlined className={styles['suggestion__icon']} />
                <div className={styles['suggestion__content']}>
                    <p className={styles['suggestion__name']}>
                        {suggestion.name}
                    </p>

                    <p className={styles['suggestion__address']}>
                        {suggestion.address}
                    </p>
                </div>
            </Button>
        </li>
    );
};
