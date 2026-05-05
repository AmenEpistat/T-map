import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { venuesStore, type OwnerVenue } from '@/entities/venue';
import { AddressPicker } from '@/shared/ui';
import type { AddressSuggestion } from '@/shared/api/nominatimApi';
import {
    useVenueEdit,
    type VenueEditFormValues,
} from '../../model/useVenueEdit';
import { VENUE_CATEGORY_OPTIONS } from '@/entities/venue';
import styles from './EditVenueForm.module.scss';

export const EditVenueForm = observer(() => {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;

        if (venuesStore.current.data?.id === id) {
            return;
        }

        void venuesStore.loadById(id);
    }, [id]);

    const { data: venue } = venuesStore.current;
    const isCurrentVenueLoaded = venue?.id === id;

    if (!isCurrentVenueLoaded || !venue) {
        return (
            <div className={styles['venue-edit-form__loading']}>
                <Spin size='large' />
            </div>
        );
    }

    return <EditVenueFormInner venue={venue} />;
});

interface EditVenueFormInnerProps {
    venue: OwnerVenue;
}

const EditVenueFormInner = ({ venue }: EditVenueFormInnerProps) => {
    const navigate = useNavigate();
    const [form] = Form.useForm<VenueEditFormValues>();
    const { submit, isSubmitting } = useVenueEdit(venue);

    const handleFinish = (values: VenueEditFormValues): void => {
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
        changedValues: Partial<VenueEditFormValues>
    ): void => {
        if ('address' in changedValues) {
            form.setFieldsValue({ lat: undefined, lng: undefined });
        }
    };

    const handleBack = (): void => {
        navigate(`/business/${venue.id}`);
    };

    return (
        <section className={styles['venue-edit-form']}>
            <header className={styles['venue-edit-form__header']}>
                <button
                    type='button'
                    onClick={handleBack}
                    className={styles['venue-edit-form__back']}
                    aria-label='Закрыть форму'
                >
                    <ArrowLeftOutlined />
                </button>

                <h2 className={styles['venue-edit-form__title']}>
                    Изменить заведение
                </h2>
            </header>

            <Form
                form={form}
                layout='vertical'
                onFinish={handleFinish}
                onValuesChange={handleValuesChange}
                disabled={isSubmitting}
                requiredMark={false}
                initialValues={{
                    name: venue.name,
                    address: venue.address,
                    category: venue.category,
                    description: venue.description,
                    lat: venue.lat,
                    lng: venue.lng,
                    dishOfDay: venue.dishOfDay,
                    music: venue.music,
                }}
                className={styles['venue-edit-form__form']}
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
                        options={VENUE_CATEGORY_OPTIONS}
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

                <Form.Item className={styles['venue-edit-form__submit']}>
                    <Button
                        type='primary'
                        htmlType='submit'
                        size='large'
                        loading={isSubmitting}
                        block
                    >
                        Изменить заведение
                    </Button>
                </Form.Item>
            </Form>
        </section>
    );
};
