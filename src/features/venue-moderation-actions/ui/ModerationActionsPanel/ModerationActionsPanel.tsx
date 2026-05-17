import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Button, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { moderationStore } from '@/entities/admin-venue';
import styles from './ModerationActionsPanel.module.scss';
import type { ErrorResponse } from '@/shared/api/types';

interface ModerationActionsPanelProps {
    venueId: string;
}

const getErrorMessage = (fallback: string, error: unknown): string => {
    if (isAxiosError<ErrorResponse>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};

export const ModerationActionsPanel = ({
    venueId,
}: ModerationActionsPanelProps) => {
    const navigate = useNavigate();
    const [reason, setReason] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const isSubmitting = isVerifying || isRejecting;

    const handleConflict = async (): Promise<void> => {
        void message.warning('Заявка уже была обработана');
        await moderationStore.loadQueue();
        navigate('/admin/moderation', { replace: true });
    };

    const handleVerify = async (): Promise<void> => {
        setIsVerifying(true);

        try {
            await moderationStore.verify(venueId);
            void message.success('Заявка одобрена. Заведение опубликовано.');
            navigate('/admin/moderation', { replace: true });
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                await handleConflict();
                return;
            }

            void message.error(
                getErrorMessage('Не удалось одобрить заявку', error)
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleReject = async (): Promise<void> => {
        setIsRejecting(true);

        try {
            await moderationStore.reject(venueId, {
                reason: reason.trim() || undefined,
            });
            void message.success('Заявка отклонена.');
            navigate('/admin/moderation', { replace: true });
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                await handleConflict();
                return;
            }

            void message.error(
                getErrorMessage('Не удалось отклонить заявку', error)
            );
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <section className={styles['moderation-actions-panel']}>
            <label className={styles['moderation-actions-panel__field']}>
                <span className={styles['moderation-actions-panel__label']}>
                    Причина отказа
                </span>
                <Input.TextArea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder='Введите причину'
                    rows={4}
                    maxLength={1000}
                    showCount
                    disabled={isSubmitting}
                    className={styles['moderation-actions-panel__textarea']}
                />
            </label>

            <div className={styles['moderation-actions-panel__actions']}>
                <Button
                    type='primary'
                    size='large'
                    loading={isVerifying}
                    disabled={isSubmitting}
                    onClick={() => void handleVerify()}
                    className={styles['moderation-actions-panel__button']}
                >
                    Одобрить
                </Button>

                <Button
                    type='default'
                    size='large'
                    loading={isRejecting}
                    disabled={isSubmitting}
                    onClick={() => void handleReject()}
                    className={styles['moderation-actions-panel__button']}
                    rootClassName={
                        styles['moderation-actions-panel__button--reject']
                    }
                >
                    Отказать
                </Button>
            </div>
        </section>
    );
};
