import { Modal, Avatar, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { mapStore } from '@/entities/map';

import styles from './TeamPopup.module.scss';
import { useIsMobile } from '@/shared/hooks/useIsMobile.ts';
import { TgOutlined } from '@/shared/ui';

export const TeamPopup = observer(() => {
    const member = mapStore.selectedTeamMember;
    const isMobile = useIsMobile();

    return (
        <Modal
            open={!!member}
            mask={isMobile}
            footer={null}
            onCancel={() => mapStore.setTeamMember(null)}
        >
            {member && (
                <div className={styles['team-popup']}>
                    <Avatar src={member.avatarUrl} size={100} />
                    <div className={styles['team-popup__info']}>
                        <h2>{member.name}</h2>
                        <p className={styles['team-popup__role']}>
                            {member.role}
                        </p>

                        {member.id === 'artur' ? (
                            <iframe
                                className={styles['team-popup__artur-video']}
                                src={member.description}
                                title='YouTube video player'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                allowFullScreen
                            />
                        ) : (
                            <p className={styles['team-popup__description']}>
                                {member.description}
                            </p>
                        )}
                        {member.img && (
                            <img
                                loading={'lazy'}
                                src={member.img}
                                alt={`${member.name} vibe`}
                                className={styles['team-popup__img']}
                            />
                        )}
                    </div>

                    <div className={styles['team-popup__contacts']}>
                        <Button
                            type={'text'}
                            icon={<GithubOutlined />}
                            href={member.github}
                            target='_blank'
                        />
                        <Button
                            type={'text'}
                            icon={<TgOutlined />}
                            href={member.tg}
                            target='_blank'
                        />
                    </div>
                </div>
            )}
        </Modal>
    );
});
