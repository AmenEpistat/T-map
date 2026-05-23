import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Spin } from 'antd';
import { loyaltyRulesStore } from '@/entities/loyalty-rule';
import { LoyaltyRuleCard } from '../LoyaltyRuleCard/LoyaltyRuleCard';
import styles from './LoyaltyRulesList.module.scss';

interface LoyaltyRulesListProps {
    venueId: string;
}

export const LoyaltyRulesList = observer(
    ({ venueId }: LoyaltyRulesListProps) => {
        const navigate = useNavigate();
        const location = useLocation();

        const { data, isLoading, error } = loyaltyRulesStore.list;
        const isFormOpen = location.pathname.includes('/loyalty/');

        useEffect(() => {
            loyaltyRulesStore.loadRules(venueId);
        }, [venueId]);

        const handleEdit = (ruleId: string): void => {
            navigate(`/business/${venueId}/loyalty/${ruleId}/edit`);
        };

        const handleAdd = (): void => {
            navigate(`/business/${venueId}/loyalty/new`);
        };

        return (
            <div className={styles['loyalty-rules-list']}>
                <div className={styles['loyalty-rules-list__header']}>
                    <h2 className={styles['loyalty-rules-list__title']}>
                        Акции лояльности
                    </h2>
                    <Button
                        type='primary'
                        onClick={handleAdd}
                        disabled={isFormOpen}
                    >
                        Добавить акцию
                    </Button>
                </div>

                <div className={styles['loyalty-rules-list__content']}>
                    {isLoading && data === null && <Spin size='large' />}

                    {error && data === null && (
                        <div className={styles['loyalty-rules-list__error']}>
                            <span>Не удалось загрузить акции</span>
                            <Button
                                onClick={() =>
                                    loyaltyRulesStore.loadRules(venueId)
                                }
                            >
                                Повторить
                            </Button>
                        </div>
                    )}

                    {data !== null && data.length === 0 && (
                        <span className={styles['loyalty-rules-list__empty']}>
                            Акций пока нет
                        </span>
                    )}

                    {data !== null && data.length > 0 && (
                        <div className={styles['loyalty-rules-list__items']}>
                            {data.map((rule) => (
                                <LoyaltyRuleCard
                                    key={rule.id}
                                    rule={rule}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
