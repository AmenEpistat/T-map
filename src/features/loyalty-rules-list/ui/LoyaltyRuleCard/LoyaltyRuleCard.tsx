import { useState } from 'react';
import { Dropdown, Tag } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { LoyaltyRuleResponse } from '@/shared/api';
import { LoyaltyRuleHistoryModal } from '@/features/loyalty-rule-history';
import styles from './LoyaltyRuleCard.module.scss';

interface LoyaltyRuleCardProps {
    rule: LoyaltyRuleResponse;
    onEdit: (ruleId: string) => void;
}

export const LoyaltyRuleCard = ({ rule, onEdit }: LoyaltyRuleCardProps) => {
    const [historyOpen, setHistoryOpen] = useState(false);

    const menuItems: MenuProps['items'] = [
        {
            key: 'edit',
            label: 'Редактировать акцию',
            onClick: () => onEdit(rule.id),
        },
        {
            key: 'history',
            label: 'История применений',
            onClick: () => setHistoryOpen(true),
        },
    ];

    return (
        <>
            <div className={styles['loyalty-rule-card']}>
                <div className={styles['loyalty-rule-card__content']}>
                    <div className={styles['loyalty-rule-card__header']}>
                        <span
                            className={styles['loyalty-rule-card__description']}
                        >
                            {rule.description}
                        </span>
                        <Tag
                            color={rule.active ? 'green' : 'default'}
                            style={{ marginInlineEnd: 0, width: 'fit-content' }}
                        >
                            {rule.active ? 'Активна' : 'Неактивна'}
                        </Tag>
                    </div>
                    <div className={styles['loyalty-rule-card__meta']}>
                        <span>Скидка: {rule.discountPercent}%</span>
                        <span>
                            Использований: {rule.remainingUsages} /{' '}
                            {rule.maxUsages}
                        </span>
                    </div>
                </div>
                <Dropdown
                    trigger={['click']}
                    menu={{ items: menuItems }}
                    placement='bottomRight'
                >
                    <button
                        type='button'
                        className={styles['loyalty-rule-card__menu']}
                        aria-label={`Действия акции: ${rule.description}`}
                    >
                        <MoreOutlined />
                    </button>
                </Dropdown>
            </div>

            <LoyaltyRuleHistoryModal
                rule={rule}
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
            />
        </>
    );
};
