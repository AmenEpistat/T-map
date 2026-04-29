import styles from './ClusterStat.module.scss';
import StatFilled from '@/features/map-cluster-popup/ui/Icons/StatFilled/StatFilled.tsx';

interface Props {
    name: string;
    count: number;
    isMoney?: boolean;
}

const ClusterStat = ({ name, count, isMoney }: Props) => {
    return (
        <div className={styles['cluster-stat']}>
            <span className={styles['cluster-stat__icon']}>
                <StatFilled />
            </span>
            <h3 className={styles['cluster-stat__name']}>{name}</h3>
            <p className={styles['cluster-stat__count']}>
                {Math.round(count)} {isMoney && '₽'}
            </p>
        </div>
    );
};

export default ClusterStat;
