import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { venuesStore } from '@/entities/venue';
import type { VenueCategory } from '@/entities/venue';

export interface VenueCreateFormValues {
    name: string;
    address: string;
    category: VenueCategory;
    description?: string;
    lat?: number;
    lng?: number;
}

export const useVenueCreate = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (values: VenueCreateFormValues): Promise<void> => {
        if (values.lat === undefined || values.lng === undefined) {
            notification.error({
                message: 'Ошибка',
                description: 'Выберите адрес из списка подсказок',
                placement: 'topRight',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await venuesStore.create({
                name: values.name,
                address: values.address,
                category: values.category,
                description: values.description,
                lat: values.lat,
                lng: values.lng,
            });
            notification.success({
                message: 'Заведение отправлено на модерацию',
                placement: 'topRight',
            });
            navigate('/business');
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось создать заведение';
            notification.error({
                message: 'Ошибка',
                description: message,
                placement: 'topRight',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submit, isSubmitting };
};
