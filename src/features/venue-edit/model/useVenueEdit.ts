import { useState } from 'react';
import { notification } from 'antd';
import {
    venuesStore,
    type OwnerVenue,
    type VenueCategory,
} from '@/entities/venue';

export interface VenueEditFormValues {
    name: string;
    address: string;
    category: VenueCategory;
    description?: string;
    lat?: number;
    lng?: number;
    dishOfDay?: string;
    music?: string;
}

export const useVenueEdit = (venue: OwnerVenue) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (values: VenueEditFormValues): Promise<void> => {
        if (values.lat === undefined || values.lng === undefined) {
            notification.error({
                message: 'Ошибка',
                description: 'Выберите адрес из списка подсказок',
                placement: 'topRight',
            });
            return;
        }

        const wasOnModeration =
            venue.moderationStatus === 'ACTIVE' ||
            venue.moderationStatus === 'REJECTED';

        setIsSubmitting(true);
        try {
            await venuesStore.update(venue.id, {
                name: values.name,
                address: values.address,
                category: values.category,
                description: values.description,
                lat: values.lat,
                lng: values.lng,
                dishOfDay: values.dishOfDay,
                music: values.music,
            });

            notification.success({
                message: wasOnModeration
                    ? 'Изменения отправлены на повторную модерацию'
                    : 'Изменения сохранены',
                placement: 'topRight',
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось сохранить изменения';

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
