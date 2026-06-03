import styles from './ProfileNoAuth.module.scss';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CloseButton from '@/shared/ui/CloseButton/CloseButton.tsx';

interface Props {
    onClose: () => void;
    isMobile: boolean;
}

const ProfileNoAuth = ({ onClose, isMobile }: Props) => {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles['profile-no-auth__header']}>
                {isMobile && <h3>Профиль</h3>}
                <CloseButton onClose={onClose} isMobile={isMobile} />
            </div>
            <div className={styles['profile-no-auth__content']}>
                <h3 className={styles['profile-no-auth__text']}>
                    Войдите в аккаунт
                </h3>
                <p className={styles['profile-no-auth__body']}>
                    Чтобы видеть свою историю использования сервисом
                </p>
                <Button
                    type={'primary'}
                    className={styles['profile-no-auth__btn']}
                    onClick={() => navigate('/auth/login')}
                >
                    Войти или создать аккаунт
                </Button>
            </div>
        </>
    );
};

export default ProfileNoAuth;
