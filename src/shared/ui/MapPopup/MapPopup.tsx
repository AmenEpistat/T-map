import { Button, Drawer } from 'antd';
import { EnvironmentFilled, CaretLeftFilled } from '@ant-design/icons';
import { SharedFilled, SharedOutlined } from '@/shared/ui';
import CloseFilled from '@/shared/ui/Icons/CloseFilled/CloseFilled.tsx';
import MapPopupImage from '@/shared/ui/MapPopup/components/MapPopupImage/MapPopupImage.tsx';
import { classNames } from '@/shared/utils/classNames.ts';
import styles from './MapPopup.module.scss';
import React from 'react';

interface Props {
    isOpen: boolean;
    isMobile: boolean;
    isLoading: boolean;
    onClose: () => void;
    handleShare: () => void;
    title: string;
    imageUrl?: string;
    children?: React.ReactNode;
    skeleton?: React.ReactNode;
}

const MapPopup = ({
    isOpen,
    isLoading,
    isMobile,
    onClose,
    handleShare,
    title,
    imageUrl,
    children,
    skeleton,
}: Props) => {
    return (
        <Drawer
            open={isOpen}
            placement={isMobile ? 'bottom' : 'left'}
            className={classNames(styles['map-popup'])}
            closable={false}
            mask={isMobile}
        >
            {isLoading ? (
                skeleton
            ) : (
                <>
                    <MapPopupImage src={imageUrl} alt={title} />

                    {isMobile && (
                        <Button
                            className={styles['map-popup__map-btn']}
                            type={'text'}
                            onClick={onClose}
                        >
                            <EnvironmentFilled
                                className={styles['map-popup__map-btn-icon']}
                            />
                        </Button>
                    )}

                    <div className={styles['map-popup__content']}>
                        <div className={styles['map-popup__header']}>
                            <h2 className={styles['map-popup__title']}>
                                {title}
                            </h2>
                            <Button
                                type='text'
                                onClick={handleShare}
                                className={classNames(
                                    !isMobile && styles['map-popup__share']
                                )}
                            >
                                {isMobile ? (
                                    <SharedFilled />
                                ) : (
                                    <SharedOutlined />
                                )}
                            </Button>
                            <Button
                                type={'text'}
                                className={styles['map-popup__close-btn']}
                                onClick={onClose}
                            >
                                {isMobile ? (
                                    <CloseFilled />
                                ) : (
                                    <CaretLeftFilled />
                                )}
                            </Button>
                        </div>

                        <div className={styles['map-popup__body']}>
                            {children}
                        </div>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default MapPopup;
