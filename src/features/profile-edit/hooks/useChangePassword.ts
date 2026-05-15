import { Form } from 'antd';
import { useState } from 'react';
import { profileStore } from '@/entities/profile';

interface ChangePasswordValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const mapChangePasswordError = (status?: number) => {
    switch (status) {
        case 401:
            return 'Неверный текущий пароль.';
        case 400:
            return 'Проверьте введённые данные.';
        default:
            return 'Не удалось сменить пароль. Попробуйте позже.';
    }
};

export const useChangePassword = (onCancel: () => void) => {
    const [form] = Form.useForm<ChangePasswordValues>();
    const [serverError, setServerError] = useState<string | null>(null);
    const { isLoading } = profileStore.changePasswordState;

    const handleFinish = async (values: ChangePasswordValues) => {
        setServerError(null);

        const success = await profileStore.changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        });

        if (success) {
            onCancel();
            form.resetFields();
            profileStore.changePasswordState.reset();
        } else {
            const error = profileStore.changePasswordState.error;
            setServerError(mapChangePasswordError(error?.status));
            form.setFields([{ name: 'currentPassword', errors: [''] }]);
        }
    };

    const handleValuesChange = () => {
        if (serverError) setServerError(null);
        form.setFields([{ name: 'currentPassword', errors: [] }]);
    };

    return {
        form,
        isLoading,
        serverError,
        handleFinish,
        handleValuesChange,
    };
};
