import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Form, Input, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/features/auth';
import styles from '../AuthForm.module.scss';

interface RegisterFormValues {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const mapRegisterError = (status?: number, message?: string): string => {
    switch (status) {
        case 409:
            return 'Пользователь с таким email уже существует.';
        case 400:
            return message ?? 'Проверьте введённые данные.';
        default:
            return 'Не удалось зарегистрироваться. Попробуйте позже.';
    }
};

export const RegisterForm = () => {
    const [form] = Form.useForm<RegisterFormValues>();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleFinish = async (values: RegisterFormValues) => {
        setIsSubmitting(true);
        setServerError(null);
        try {
            const { confirmPassword: _confirmPassword, ...payload } = values;
            await authStore.register(payload);
            const from =
                (location.state as { from?: { pathname: string } } | null)?.from
                    ?.pathname ?? '/';
            navigate(from, { replace: true });
        } catch (error) {
            const status = isAxiosError(error)
                ? error.response?.status
                : undefined;
            const message = isAxiosError(error)
                ? error.response?.data?.message
                : undefined;
            setServerError(mapRegisterError(status, message));

            form.setFields([{ name: 'email', errors: [''] }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            onValuesChange={() => {
                setServerError(null);
                form.setFields([{ name: 'email', errors: [] }]);
            }}
            className={styles.form}
            requiredMark={false}
            disabled={isSubmitting}
        >
            <div className={styles.fields}>
                <Form.Item
                    name='nickname'
                    rules={[
                        { required: true, message: 'Введите имя пользователя' },
                        { min: 3, message: 'Минимум 3 символа' },
                    ]}
                >
                    <Input
                        placeholder='Имя пользователя'
                        size='large'
                        autoComplete='username'
                    />
                </Form.Item>

                <Form.Item
                    name='email'
                    rules={[
                        { required: true, message: 'Введите email' },
                        { type: 'email', message: 'Некорректный email' },
                    ]}
                >
                    <Input
                        placeholder='Email'
                        size='large'
                        autoComplete='email'
                    />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[
                        { required: true, message: 'Введите пароль' },
                        { min: 8, message: 'Минимум 8 символов' },
                        {
                            pattern: /\d/,
                            message:
                                'Пароль должен содержать хотя бы одну цифру',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder='Пароль'
                        size='large'
                        autoComplete='new-password'
                    />
                </Form.Item>

                <Form.Item
                    name='confirmPassword'
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Повторите пароль' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
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
                        placeholder='Повторите пароль'
                        size='large'
                        autoComplete='new-password'
                    />
                </Form.Item>
            </div>

            {serverError && (
                <p className={styles.serverError} role='alert'>
                    {serverError}
                </p>
            )}

            <Form.Item noStyle>
                <Button
                    type='primary'
                    htmlType='submit'
                    size='large'
                    block
                    loading={isSubmitting}
                >
                    Продолжить
                </Button>
            </Form.Item>

            <div className={styles.footer}>
                <Link to='/auth/login' className={styles.link}>
                    Уже зарегистрированы?
                </Link>
            </div>
        </Form>
    );
};
