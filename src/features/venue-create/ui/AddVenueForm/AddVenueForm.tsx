import { Link } from 'react-router-dom';
import { Form, Input, Select, Button } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useVenueCreate } from '../../model/useVenueCreate';
import type { VenueCreateFormValues } from '../../model/useVenueCreate';
import styles from './AddVenueForm.module.scss';

const CATEGORY_OPTIONS = [
    { value: 'food', label: 'Еда и напитки' },
    { value: 'entertainment', label: 'Развлечения' },
    { value: 'shopping', label: 'Шоппинг' },
];

export const AddVenueForm = () => {
    const { submit, isSubmitting } = useVenueCreate();

    const handleFinish = (values: VenueCreateFormValues): void => {
        void submit(values);
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
                layout='vertical'
                onFinish={handleFinish}
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
                        { min: 5, message: 'Минимум 5 символов' },
                        { max: 200, message: 'Максимум 200 символов' },
                    ]}
                >
                    <Input placeholder='Введите адрес' size='large' />
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
