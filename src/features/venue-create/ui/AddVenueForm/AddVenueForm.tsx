import { Link } from 'react-router-dom';
import { Form, Input, Select, Button } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useVenueCreate } from '../../model/useVenueCreate';
import type { VenueCreateFormValues } from '../../model/useVenueCreate';
import { AddressPicker } from '../AddressPicker/AddressPicker';
import type { AddressSuggestion } from '../../api/nominatimApi';
import styles from './AddVenueForm.module.scss';

const CATEGORY_OPTIONS = [
    { value: 'food', label: 'Еда и напитки' },
    { value: 'entertainment', label: 'Развлечения' },
    { value: 'shopping', label: 'Шоппинг' },
];

export const AddVenueForm = () => {
    const [form] = Form.useForm<VenueCreateFormValues>();
    const { submit, isSubmitting } = useVenueCreate();

    const handleFinish = (values: VenueCreateFormValues): void => {
        void submit(values);
    };

    const handleAddressSelect = (suggestion: AddressSuggestion): void => {
        form.setFieldsValue({
            address: suggestion.address,
            lat: suggestion.lat,
            lng: suggestion.lng,
        });

        void form.validateFields(['address']);
    };

    const handleValuesChange = (
        changedValues: Partial<VenueCreateFormValues>
    ): void => {
        if ('address' in changedValues) {
            form.setFieldsValue({ lat: undefined, lng: undefined });
        }
    };

    return (
        <section className={styles['venue-create-form']}>
            <header className={styles['venue-create-form__header']}>
                <Link
                    to='/business'
                    className={styles['venue-create-form__back']}
                    aria-label='Закрыть форму и вернуться к списку'
                >
                    <ArrowLeftOutlined />
                </Link>
                <h2 className={styles['venue-create-form__title']}>
                    Добавить заведение
                </h2>
            </header>

            <Form
                form={form}
                layout='vertical'
                onFinish={handleFinish}
                onValuesChange={handleValuesChange}
                disabled={isSubmitting}
                requiredMark={false}
                className={styles['venue-create-form__form']}
            >
                <Form.Item
                    label='Название заведения'
                    name='name'
                    rules={[
                        { required: true, message: 'Введите название' },
                        { min: 2, message: 'Минимум 2 символа' },
                        { max: 100, message: 'Максимум 100 символов' },
                    ]}
                >
                    <Input placeholder='Введите название' size='large' />
                </Form.Item>

                <Form.Item
                    label='Адрес заведения'
                    name='address'
                    rules={[
                        { required: true, message: 'Введите адрес' },
                        {
                            validator: async () => {
                                const lat = form.getFieldValue('lat');
                                const lng = form.getFieldValue('lng');
                                if (lat === undefined || lng === undefined) {
                                    throw new Error(
                                        'Выберите адрес из списка подсказок'
                                    );
                                }
                            },
                        },
                    ]}
                >
                    <AddressPicker
                        placeholder='Введите адрес'
                        onSelect={handleAddressSelect}
                    />
                </Form.Item>

                <Form.Item name='lat' hidden>
                    <Input type='hidden' />
                </Form.Item>

                <Form.Item name='lng' hidden>
                    <Input type='hidden' />
                </Form.Item>

                <Form.Item
                    label='Категория'
                    name='category'
                    rules={[{ required: true, message: 'Выберите категорию' }]}
                >
                    <Select
                        placeholder='Категория'
                        size='large'
                        options={CATEGORY_OPTIONS}
                    />
                </Form.Item>

                <Form.Item
                    label='Описание'
                    name='description'
                    rules={[{ max: 500, message: 'Максимум 500 символов' }]}
                >
                    <Input.TextArea
                        placeholder='Введите описание'
                        rows={4}
                        size='large'
                    />
                </Form.Item>

                <Form.Item
                    label='Акция дня'
                    name='dishOfDay'
                    rules={[{ max: 200, message: 'Максимум 200 символов' }]}
                >
                    <Input placeholder='Введите акцию дня' size='large' />
                </Form.Item>

                <Form.Item
                    label='Музыка'
                    name='music'
                    rules={[{ max: 200, message: 'Максимум 200 символов' }]}
                >
                    <Input placeholder='Введите музыку' size='large' />
                </Form.Item>
                <Form.Item className={styles['venue-create-form__submit']}>
                    <Button
                        type='primary'
                        htmlType='submit'
                        size='large'
                        icon={<PlusOutlined />}
                        loading={isSubmitting}
                        block
                    >
                        Добавить заведение
                    </Button>
                </Form.Item>
            </Form>
        </section>
    );
};
