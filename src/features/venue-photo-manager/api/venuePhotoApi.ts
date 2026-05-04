import { apiClient } from '@/shared/api/client';
import type { OwnerVenue } from '@/entities/venue';

export const venuePhotoApi = {
    uploadPhoto: async (
        id: string,
        file: File,
        onProgress?: (percent: number) => void
    ): Promise<OwnerVenue> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<OwnerVenue>(
            `/business/venues/${id}/photo`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    if (event.total && onProgress) {
                        const percent = Math.round(
                            (event.loaded / event.total) * 100
                        );
                        onProgress(percent);
                    }
                },
            }
        );

        return response.data;
    },

    deletePhoto: async (id: string): Promise<OwnerVenue> => {
        const response = await apiClient.delete<OwnerVenue>(
            `/business/venues/${id}/photo`
        );

        return response.data;
    },
};
