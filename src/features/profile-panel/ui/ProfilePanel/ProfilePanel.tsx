import { Drawer } from 'antd';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';
import { authStore } from '@/features/auth';
import styles from './ProfilePanel.module.scss';
import ProfileAuth from '@/features/profile-panel/ui/ProfileAuth/ProfileAuth.tsx';
import ProfileNoAuth from '@/features/profile-panel/ui/ProfileNoAuth/ProfileNoAuth.tsx';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const ProfilePanel = ({ isOpen, onClose }: Props) => {
    const isMobile = useIsMobile();
    const isAuth = authStore.isAuthenticated;

    return (
        <Drawer
            open={isOpen}
            closable={false}
            placement={isMobile ? 'bottom' : 'left'}
            className={styles['profile-panel']}
            mask={isMobile}
        >
            <div className={styles['profile-panel__content']}>
                {isAuth ? (
                    <ProfileAuth
                        isMobile={isMobile}
                        onClose={onClose}
                        user={authStore.user!}
                    />
                ) : (
                    <ProfileNoAuth isMobile={isMobile} onClose={onClose} />
                )}
            </div>
        </Drawer>
    );
};

export default ProfilePanel;
