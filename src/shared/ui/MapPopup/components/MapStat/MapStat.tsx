import styles from './MapStat.module.scss';
import React from 'react';

interface Props {
    icon: React.ReactNode;
    title: string;
    data: string;
}

const MapStat = ({ icon, title, data }: Props) => {
    return (
        <div className={styles['venue-stat']}>
            <span className={styles['venue-stat__icon']}>{icon}</span>
            <h3 className={styles['venue-stat__title']}>{title}</h3>
            <p className={styles['venue-stat__text']}>{data}</p>
        </div>
    );
};

export default MapStat;
