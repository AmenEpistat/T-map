import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authStore } from '@/features/auth';
import { isAxiosError } from 'axios';
import styles from './LoginForm.module.scss';

interface LoginFormValues {
    email: string;
    password: string;
}

const mapLoginError = (status?: number): string => {
    switch (status) {
        case 401:
            return 'Email или пароль введены неверно.';
        case 403:
            return 'Аккаунт заблокирован. Обратитесь в поддержку.';
        case 400:
            return 'Проверьте введённые данные.';
        default:
            return 'Не удалось войти. Попробуйте позже.';
    }
};

export const LoginForm = () => {
    const [form] = Form.useForm<LoginFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFinish = async (values: LoginFormValues) => {
        setIsSubmitting(true);
        setServerError(null);
        try {
            await authStore.login(values);
            navigate('/', { replace: true });
        } catch (error) {
            const status = isAxiosError(error)
                ? error.response?.status
                : undefined;
            const message = mapLoginError(status);
            setServerError(message);

            form.setFields([
                { name: 'email', errors: [''] },
                { name: 'password', errors: [''] },
            ]);
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
                form.setFields([
                    { name: 'email', errors: [] },
                    { name: 'password', errors: [] },
                ]);
            }}
            className={styles.form}
            requiredMark={false}
            disabled={isSubmitting}
        >
            <div className={styles.fields}>
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
                        autoComplete='current-password'
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
                    Войти
                </Button>
            </Form.Item>

            <div className={styles.footer}>
                <Link to='/auth/register' className={styles.link}>
                    Ещё не зарегистрированы?
                </Link>
            </div>
        </Form>
    );
};
