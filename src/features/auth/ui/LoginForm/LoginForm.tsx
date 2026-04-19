import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';

interface LoginFormValues {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const [form] = Form.useForm<LoginFormValues>();

    const handleFinish = (values: LoginFormValues) => {
        // eslint-disable-next-line no-console
        console.log('login submit:', values);
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

            <Form.Item noStyle>
                <Button type='primary' htmlType='submit' size='large' block>
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
