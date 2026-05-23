import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Switch, Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { loyaltyRulesStore } from '@/entities/loyalty-rule';
import type { LoyaltyRuleResponse } from '@/shared/api';
import {
    useLoyaltyRuleEdit,
    type LoyaltyRuleEditFormValues,
} from '../../model/useLoyaltyRuleEdit';
import styles from './EditLoyaltyRuleForm.module.scss';

export const EditLoyaltyRuleForm = observer(() => {
    const { id: venueId, ruleId } = useParams<{ id: string; ruleId: string }>();

    useEffect(() => {
        if (!ruleId) return;
        if (loyaltyRulesStore.current.data?.id === ruleId) return;
        void loyaltyRulesStore.loadRule(ruleId);
    }, [ruleId]);

    const { data: rule } = loyaltyRulesStore.current;
    const isCurrentRuleLoaded = rule?.id === ruleId;

    if (!isCurrentRuleLoaded || !rule) {
        return (
            <div className={styles['loyalty-rule-edit-form__loading']}>
                <Spin size='large' />
            </div>
        );
    }

    return <EditLoyaltyRuleFormInner rule={rule} venueId={venueId ?? ''} />;
});

interface EditLoyaltyRuleFormInnerProps {
    rule: LoyaltyRuleResponse;
    venueId: string;
}

const EditLoyaltyRuleFormInner = ({
    rule,
    venueId,
}: EditLoyaltyRuleFormInnerProps) => {
    const navigate = useNavigate();
    const [form] = Form.useForm<LoyaltyRuleEditFormValues>();
    const { submit, isSubmitting } = useLoyaltyRuleEdit(rule);

    const handleFinish = (values: LoyaltyRuleEditFormValues): void => {
        void submit(values);
    };

    const handleBack = (): void => {
        navigate(`/business/${venueId}/loyalty`);
    };

    return (
        <section className={styles['loyalty-rule-edit-form']}>
            <header className={styles['loyalty-rule-edit-form__header']}>
                <button
                    type='button'
                    onClick={handleBack}
                    className={styles['loyalty-rule-edit-form__back']}
                    aria-label='Закрыть форму'
                >
                    <ArrowLeftOutlined />
                </button>
                <h2 className={styles['loyalty-rule-edit-form__title']}>
                    Редактировать акцию
                </h2>
            </header>

            <Form
                form={form}
                layout='vertical'
                onFinish={handleFinish}
                disabled={isSubmitting}
                requiredMark={false}
                initialValues={{
                    description: rule.description,
                    discountPercent: rule.discountPercent,
                    maxUsages: rule.maxUsages,
                    active: rule.active,
                }}
                className={styles['loyalty-rule-edit-form__form']}
            >
                <Form.Item
                    label='Описание акции'
                    name='description'
                    rules={[
                        { required: true, message: 'Введите описание' },
                        { max: 500, message: 'Максимум 500 символов' },
                    ]}
                >
                    <Input.TextArea
                        placeholder='Например: скидка 15% на все напитки'
                        rows={3}
                        size='large'
                    />
                </Form.Item>

                <Form.Item
                    label='Размер скидки (%)'
                    name='discountPercent'
                    rules={[
                        { required: true, message: 'Укажите размер скидки' },
                    ]}
                >
                    <InputNumber
                        min={1}
                        max={100}
                        size='large'
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label='Максимум применений'
                    name='maxUsages'
                    rules={[
                        { required: true, message: 'Укажите лимит применений' },
                    ]}
                >
                    <InputNumber
                        min={1}
                        size='large'
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label='Акция активна'
                    name='active'
                    valuePropName='checked'
                >
                    <Switch />
                </Form.Item>

                <Form.Item className={styles['loyalty-rule-edit-form__submit']}>
                    <Button
                        type='primary'
                        htmlType='submit'
                        size='large'
                        loading={isSubmitting}
                        block
                    >
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>
        </section>
    );
};
