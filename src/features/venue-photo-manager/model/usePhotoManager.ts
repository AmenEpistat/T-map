import { useEffect, useState } from 'react';
import { message, notification } from 'antd';
import { venuesStore, type OwnerVenue } from '@/entities/venue';
import { venuePhotoApi } from '../api/venuePhotoApi';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

interface UsePhotoManagerOptions {
    onSuccess?: () => void;
}

interface UsePhotoManagerResult {
    selectedFile: File | null;
    previewUrl: string | null;
    progress: number;
    isUploading: boolean;
    isDeleting: boolean;
    selectFile: (file: File) => boolean;
    clearFile: () => void;
    upload: () => Promise<void>;
    deletePhoto: () => Promise<void>;
}

export const usePhotoManager = (
    venue: OwnerVenue,
    options?: UsePhotoManagerOptions
): UsePhotoManagerResult => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const selectFile = (file: File): boolean => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            void message.error(
                'Неподдерживаемый формат. Разрешены JPG, PNG, WEBP'
            );
            return false;
        }

        if (file.size > MAX_SIZE_BYTES) {
            void message.error('Файл слишком большой. Максимум 10 МБ');
            return false;
        }

        setSelectedFile(file);
        return true;
    };

    const clearFile = (): void => {
        setSelectedFile(null);
        setProgress(0);
    };

    const wasOnModeration =
        venue.moderationStatus === 'ACTIVE' ||
        venue.moderationStatus === 'REJECTED';

    const upload = async (): Promise<void> => {
        if (!selectedFile) {
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const updatedVenue = await venuePhotoApi.uploadPhoto(
                venue.id,
                selectedFile,
                (percent) => setProgress(percent)
            );

            venuesStore.syncVenue(updatedVenue);

            notification.success({
                message: wasOnModeration
                    ? 'Фото обновлено. Изменения отправлены на повторную модерацию'
                    : 'Фото обновлено',
                placement: 'topRight',
            });

            setSelectedFile(null);
            setProgress(0);
            options?.onSuccess?.();
        } catch (error) {
            const description =
                error instanceof Error
                    ? error.message
                    : 'Не удалось загрузить фото';

            notification.error({
                message: 'Ошибка',
                description,
                placement: 'topRight',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const deletePhoto = async (): Promise<void> => {
        setIsDeleting(true);

        try {
            const updatedVenue = await venuePhotoApi.deletePhoto(venue.id);

            venuesStore.syncVenue(updatedVenue);

            notification.success({
                message: wasOnModeration
                    ? 'Фото удалено. Изменения отправлены на повторную модерацию'
                    : 'Фото удалено',
                placement: 'topRight',
            });

            options?.onSuccess?.();
        } catch (error) {
            const description =
                error instanceof Error
                    ? error.message
                    : 'Не удалось удалить фото';

            notification.error({
                message: 'Ошибка',
                description,
                placement: 'topRight',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        selectedFile,
        previewUrl,
        progress,
        isUploading,
        isDeleting,
        selectFile,
        clearFile,
        upload,
        deletePhoto,
    };
};
