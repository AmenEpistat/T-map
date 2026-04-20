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
                <Form.Item name='nickname'>
                    <Input
                        placeholder='Имя пользователя'
                        size='large'
                        autoComplete='username'
                    />
                </Form.Item>

                <Form.Item name='email'>
                    <Input
                        placeholder='Email'
                        size='large'
                        autoComplete='email'
                    />
                </Form.Item>

                <Form.Item name='password'>
                    <Input.Password
                        placeholder='Пароль'
                        size='large'
                        autoComplete='new-password'
                    />
                </Form.Item>

                <Form.Item name='confirmPassword'>
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
