import { Spin } from 'antd';
import styles from './Splash.module.scss';

export const Splash = () => {
    return (
        <div className={styles.splash} role='status' aria-live='polite'>
            <Spin size='large' />
        </div>
    );
};
