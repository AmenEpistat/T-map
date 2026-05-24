import { Modal, Pagination, Skeleton } from 'antd';
import type { LoyaltyRuleResponse } from '@/shared/api';
import { useLoyaltyRuleHistory } from '../../model/useLoyaltyRuleHistory';
import { LoyaltyRuleHistoryItem } from '../LoyaltyRuleHistoryItem/LoyaltyRuleHistoryItem';
import styles from './LoyaltyRuleHistoryModal.module.scss';

interface LoyaltyRuleHistoryModalProps {
    rule: LoyaltyRuleResponse;
    open: boolean;
    onClose: () => void;
}

export const LoyaltyRuleHistoryModal = ({
    rule,
    open,
    onClose,
}: LoyaltyRuleHistoryModalProps) => {
    const { data, isLoading, page, setPage, pageSize } = useLoyaltyRuleHistory(
        open ? rule.id : null
    );

    const isEmpty = !isLoading && (!data || data.items.length === 0);

    return (
        <Modal
            title={rule.description}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <div className={styles['history-modal']}>
                {isLoading && (
                    <div className={styles['history-modal__skeleton']}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} active paragraph={{ rows: 1 }} />
                        ))}
                    </div>
                )}

                {isEmpty && (
                    <span className={styles['history-modal__empty']}>
                        Акция ещё не применялась
                    </span>
                )}

                {!isLoading && data && data.items.length > 0 && (
                    <>
                        <div className={styles['history-modal__list']}>
                            {data.items.map((item) => (
                                <LoyaltyRuleHistoryItem
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>
                        {data.totalPages > 1 && (
                            <Pagination
                                current={page + 1}
                                pageSize={pageSize}
                                total={data.totalElements}
                                onChange={(p) => setPage(p - 1)}
                                showSizeChanger={false}
                            />
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
};
