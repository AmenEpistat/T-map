import styles from './ProfileAuth.module.scss';
import type { User } from '@/entities/profile';
import { observer } from 'mobx-react-lite';
import ProfileAuthHeader from '@/features/profile-panel/ui/ProfileAuthHeader/ProfileAuthHeader.tsx';

interface Props {
    user?: User;
    onClose: () => void;
    isMobile: boolean;
}

const ProfileAuth = observer(({ onClose, isMobile }: Props) => {
    return (
        <div className={styles['profile-auth']}>
            <ProfileAuthHeader onClose={onClose} isMobile={isMobile} />
        </div>
    );
});

export default ProfileAuth;
