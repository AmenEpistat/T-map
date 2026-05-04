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

const normalizeText = (value?: string): string => value?.trim() ?? '';

const hasVenueEditChanges = (
    venue: OwnerVenue,
    values: VenueEditFormValues
): boolean =>
    values.name.trim() !== venue.name.trim() ||
    values.address.trim() !== venue.address.trim() ||
    values.category !== venue.category ||
    normalizeText(values.description) !== normalizeText(venue.description) ||
    values.lat !== venue.lat ||
    values.lng !== venue.lng ||
    normalizeText(values.dishOfDay) !== normalizeText(venue.dishOfDay) ||
    normalizeText(values.music) !== normalizeText(venue.music);

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

        if (!hasVenueEditChanges(venue, values)) {
            notification.info({
                message: 'Нет изменений для сохранения',
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
