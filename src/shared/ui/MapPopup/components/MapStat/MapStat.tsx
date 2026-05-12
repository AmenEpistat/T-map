import styles from './MapStat.module.scss';
import React from 'react';

interface Props {
    icon: React.ReactNode;
    title?: string;
    data: string | React.ReactNode;
}

const MapStat = ({ icon, title, data }: Props) => {
    return (
        <div className={styles['map-stat']}>
            <span className={styles['map-stat__icon']}>{icon}</span>
            {title && <h3 className={styles['map-stat__title']}>{title}</h3>}
            <p className={styles['map-stat__text']}>{data}</p>
        </div>
    );
};

export default MapStat;
