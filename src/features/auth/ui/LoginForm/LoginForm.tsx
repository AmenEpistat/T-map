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
                <Form.Item name='email' noStyle>
                    <Input
                        placeholder='Email'
                        size='large'
                        autoComplete='email'
                    />
                </Form.Item>

                <Form.Item name='password' noStyle>
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
