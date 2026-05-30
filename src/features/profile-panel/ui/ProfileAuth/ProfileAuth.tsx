import styles from './ProfileAuth.module.scss';
import { observer } from 'mobx-react-lite';
import ProfileAuthHeader from '@/features/profile-panel/ui/ProfileAuthHeader/ProfileAuthHeader.tsx';
import type { User } from '@/features/auth';
import { ProfileHistory } from '@/features/profile-history';

interface Props {
    user?: User;
    onClose: () => void;
    isMobile: boolean;
}

const ProfileAuth = observer(({ onClose, isMobile }: Props) => {
    return (
        <div className={styles['profile-auth']}>
            <ProfileAuthHeader onClose={onClose} isMobile={isMobile} />
            <div className={styles['profile__divider']} />
            <ProfileHistory />
        </div>
    );
});

export default ProfileAuth;
