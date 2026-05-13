import { Form, Input, Button } from 'antd';
import { observer } from 'mobx-react-lite';
import styles from './ChangePasswordForm.module.scss';
import { useChangePassword } from '@/features/profile-edit/hooks/useChangePassword.ts';

interface Props {
    onCancel: () => void;
}

export const ChangePasswordForm = observer(({ onCancel }: Props) => {
    const { form, isLoading, serverError, handleFinish, handleValuesChange } =
        useChangePassword(onCancel);

    return (
        <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
            disabled={isLoading}
            requiredMark={false}
            className={styles['form']}
        >
            <div>
                <Form.Item
                    name='currentPassword'
                    rules={[
                        {
                            required: true,
                            message: 'Введите текущий пароль',
                        },
                    ]}
                >
                    <Input.Password placeholder='Текущий пароль' size='large' />
                </Form.Item>

                <Form.Item
                    name='newPassword'
                    rules={[
                        { required: true, message: 'Введите новый пароль' },
                        { min: 8, message: 'Минимум 8 символов' },
                    ]}
                >
                    <Input.Password placeholder='Новый пароль' size='large' />
                </Form.Item>

                <Form.Item
                    className={styles['form__item']}
                    name='confirmPassword'
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Повторите пароль' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('newPassword') === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Пароли не совпадают')
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder='Повторите новый пароль'
                        size='large'
                    />
                </Form.Item>
            </div>

            {serverError && (
                <p className={styles['form__error']} role='alert'>
                    {serverError}
                </p>
            )}

            <Form.Item noStyle>
                <Button
                    type='primary'
                    htmlType='submit'
                    block
                    loading={isLoading}
                    size='large'
                >
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    );
});
