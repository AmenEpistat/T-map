import { FileSearchOutlined } from '@ant-design/icons';
import styles from './AdminModerationEmptyState.module.scss';

export const AdminModerationEmptyState = () => {
    return (
        <div className={styles['admin-moderation-empty-state']}>
            <FileSearchOutlined
                className={styles['admin-moderation-empty-state__icon']}
            />
            <p className={styles['admin-moderation-empty-state__text']}>
                Выберите заявку из списка
            </p>
        </div>
    );
};
