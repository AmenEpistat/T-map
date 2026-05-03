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

// TODO: remove fallback after AddressPicker is fully wired (Step 5)
const KAZAN_CENTER = { lat: 55.7887, lng: 49.1221 };

export const useVenueCreate = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (values: VenueCreateFormValues): Promise<void> => {
        setIsSubmitting(true);
        try {
            await venuesStore.create({
                ...KAZAN_CENTER,
                ...values,
                lat: values.lat ?? KAZAN_CENTER.lat,
                lng: values.lng ?? KAZAN_CENTER.lng,
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
