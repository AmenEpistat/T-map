import { Link, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useLoyaltyRuleCreate } from '../../model/useLoyaltyRuleCreate';
import type { LoyaltyRuleCreateFormValues } from '../../model/useLoyaltyRuleCreate';
import styles from './CreateLoyaltyRuleForm.module.scss';

export const CreateLoyaltyRuleForm = () => {
    const { id: venueId = '' } = useParams<{ id: string }>();
    const [form] = Form.useForm<LoyaltyRuleCreateFormValues>();
    const { submit, isSubmitting } = useLoyaltyRuleCreate(venueId);

    const handleFinish = (values: LoyaltyRuleCreateFormValues): void => {
        void submit(values);
    };

    return (
        <section className={styles['loyalty-rule-create-form']}>
            <header className={styles['loyalty-rule-create-form__header']}>
                <Link
                    to={`/business/${venueId}/loyalty`}
                    className={styles['loyalty-rule-create-form__back']}
                    aria-label='Закрыть форму и вернуться к списку акций'
                >
                    <ArrowLeftOutlined />
                </Link>
                <h2 className={styles['loyalty-rule-create-form__title']}>
                    Добавить акцию
                </h2>
            </header>

            <Form
                form={form}
                layout='vertical'
                onFinish={handleFinish}
                disabled={isSubmitting}
                requiredMark={false}
                className={styles['loyalty-rule-create-form__form']}
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
                        placeholder='15'
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
                        placeholder='100'
                        min={1}
                        size='large'
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    className={styles['loyalty-rule-create-form__submit']}
                >
                    <Button
                        type='primary'
                        htmlType='submit'
                        size='large'
                        icon={<PlusOutlined />}
                        loading={isSubmitting}
                        block
                    >
                        Создать акцию
                    </Button>
                </Form.Item>
            </Form>
        </section>
    );
};
