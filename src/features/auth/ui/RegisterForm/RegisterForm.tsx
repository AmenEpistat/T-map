import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import styles from './RegisterForm.module.scss';

interface RegisterFormValues {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const RegisterForm = () => {
    const [form] = Form.useForm<RegisterFormValues>();

    const handleFinish = (values: RegisterFormValues) => {
        console.log('register submit:', values);
    };

    return (
        <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            className={styles.form}
            requiredMark={false}
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

            <Form.Item noStyle>
                <Button type='primary' htmlType='submit' size='large' block>
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
