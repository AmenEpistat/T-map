import { Modal, Upload, Button, Popconfirm, Progress } from 'antd';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { OwnerVenue } from '@/entities/venue';
import { usePhotoManager } from '../../model/usePhotoManager';
import styles from './PhotoManagerModal.module.scss';

interface PhotoManagerModalProps {
    venue: OwnerVenue;
    open: boolean;
    onClose: () => void;
}

export const PhotoManagerModal = ({
    venue,
    open,
    onClose,
}: PhotoManagerModalProps) => {
    const {
        selectedFile,
        previewUrl,
        progress,
        isUploading,
        isDeleting,
        selectFile,
        clearFile,
        upload,
        deletePhoto,
    } = usePhotoManager(venue, {
        onSuccess: onClose,
    });

    const handleClose = (): void => {
        clearFile();
        onClose();
    };

    const hasExistingPhoto = !!venue.photoUrl;
    const displayUrl = previewUrl ?? venue.photoUrl ?? null;
    const title = hasExistingPhoto ? 'Управление фото' : 'Загрузить фото';

    return (
        <Modal
            title={title}
            open={open}
            onCancel={handleClose}
            footer={null}
            destroyOnClose
        >
            <div className={styles['photo-modal']}>
                <Upload.Dragger
                    accept='image/jpeg,image/png,image/webp'
                    beforeUpload={(file) => {
                        const isValid = selectFile(file);

                        return isValid ? false : Upload.LIST_IGNORE;
                    }}
                    showUploadList={false}
                    multiple={false}
                    maxCount={1}
                    disabled={isUploading || isDeleting}
                    className={styles['photo-modal__dragger']}
                >
                    {displayUrl ? (
                        <div className={styles['photo-modal__preview']}>
                            <img
                                src={displayUrl}
                                alt='Превью'
                                className={styles['photo-modal__preview-image']}
                            />
                        </div>
                    ) : (
                        <div className={styles['photo-modal__placeholder']}>
                            <CloudUploadOutlined
                                className={
                                    styles['photo-modal__placeholder-icon']
                                }
                            />
                            <p
                                className={
                                    styles['photo-modal__placeholder-text']
                                }
                            >
                                Перетащите файл сюда или нажмите
                            </p>
                        </div>
                    )}
                </Upload.Dragger>

                <p className={styles['photo-modal__hint']}>
                    Форматы: JPG, PNG, WEBP. Максимум 10 МБ
                </p>

                {selectedFile && (
                    <p className={styles['photo-modal__filename']}>
                        Выбран файл: {selectedFile.name}
                    </p>
                )}

                {isUploading && (
                    <Progress
                        percent={progress}
                        size='small'
                        className={styles['photo-modal__progress']}
                    />
                )}

                <div className={styles['photo-modal__actions']}>
                    {selectedFile && (
                        <Button
                            type='primary'
                            size='large'
                            onClick={() => void upload()}
                            loading={isUploading}
                            disabled={isDeleting}
                            block
                        >
                            {hasExistingPhoto ? 'Заменить' : 'Загрузить'}
                        </Button>
                    )}

                    {hasExistingPhoto && (
                        <Popconfirm
                            title='Удалить фото?'
                            description='Текущее фото будет удалено. Действие нельзя отменить.'
                            onConfirm={() => void deletePhoto()}
                            okText='Удалить'
                            cancelText='Отмена'
                            okButtonProps={{
                                danger: true,
                                loading: isDeleting,
                            }}
                            placement='top'
                        >
                            <Button
                                size='large'
                                icon={<DeleteOutlined />}
                                disabled={isUploading}
                                danger
                                block
                            >
                                Удалить фото
                            </Button>
                        </Popconfirm>
                    )}
                </div>
            </div>
        </Modal>
    );
};
