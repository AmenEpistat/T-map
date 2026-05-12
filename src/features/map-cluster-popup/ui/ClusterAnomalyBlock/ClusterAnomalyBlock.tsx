import styles from './ClusterAnomalyBlock.module.scss';
import { FireFilled } from '@ant-design/icons';

interface Props {
    isAnomaly: boolean;
    ratio?: number;
    baseline?: number;
}

const ClusterAnomalyBlock = ({ isAnomaly, ratio, baseline }: Props) => {
    return (
        <>
            <h3 className={styles['anomaly-block__title']}>Аномалии</h3>
            {isAnomaly ? (
                <>
                    <div className={styles['anomaly-block__anomaly']}>
                        <FireFilled className={styles['anomaly-block__icon']} />
                        Зафиксировано в{' '}
                        <span className={styles['anomaly-block__stat--ratio']}>
                            {ratio}
                        </span>{' '}
                        раз больше транзакций, чем обычно. Среднее количество
                        транзакций за тот же час -{' '}
                        <span className={styles['anomaly-block__stat--base']}>
                            {baseline}
                        </span>{' '}
                        в этой зоне.
                    </div>
                </>
            ) : (
                <>
                    <div className={styles['anomaly-block__no-anomalies']}>
                        На данный момент аномалий нет. Посещаемость в пределах
                        нормы
                    </div>
                </>
            )}
        </>
    );
};

export default ClusterAnomalyBlock;
