import { observer } from 'mobx-react-lite';
import { Modal, Button, Spin, Result } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import QrScanner from 'qr-scanner';
import { qrScanStore } from '../../model/qrScanStore';
import { useQrScanner } from '../../hooks/useQrScanner';
import styles from './QrScanModal.module.scss';

const ScannerView = observer(() => {
    const handleScan = (data: string): void => {
        if (!qrScanStore.activation.isLoading && !qrScanStore.activation.data) {
            void qrScanStore.activate(data);
        }
    };

    const videoRef = useQrScanner(handleScan);

    const handleFileChange = async (file: File): Promise<void> => {
        try {
            const result = await QrScanner.scanImage(file, {
                returnDetailedScanResult: true,
            });
            handleScan(result.data);
        } catch {
            // QR-код не найден в изображении — пользователь попробует другой файл
        }
    };

    return (
        <div className={styles['qr-scan-modal__scanner']}>
            <div className={styles['qr-scan-modal__video-wrapper']}>
                <video
                    ref={videoRef}
                    className={styles['qr-scan-modal__video']}
                    muted
                    playsInline
                />
                {qrScanStore.activation.isLoading && (
                    <div className={styles['qr-scan-modal__overlay']}>
                        <Spin size='large' />
                    </div>
                )}
            </div>
            <label className={styles['qr-scan-modal__file-label']}>
                <UploadOutlined /> Загрузить фото QR-кода
                <input
                    type='file'
                    accept='image/*'
                    className={styles['qr-scan-modal__file-input']}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleFileChange(file);
                        e.target.value = '';
                    }}
                />
            </label>
        </div>
    );
});

export const QrScanModal = observer(() => {
    const { isOpen, activation, close } = qrScanStore;

    return (
        <Modal
            title='Сканировать QR-код акции'
            open={isOpen}
            onCancel={close}
            footer={null}
            destroyOnClose
        >
            {activation.data ? (
                <div className={styles['qr-scan-modal__result']}>
                    <Result
                        status='success'
                        title='Акция активирована'
                        subTitle={
                            <>
                                <span>
                                    Покупатель:{' '}
                                    <strong>{activation.data.userLabel}</strong>
                                </span>
                                <br />
                                <span>
                                    Скидка:{' '}
                                    <strong>
                                        {activation.data.discountApplied}%
                                    </strong>
                                </span>
                            </>
                        }
                    />
                    <Button
                        type='primary'
                        block
                        onClick={() => activation.reset()}
                    >
                        Сканировать следующего
                    </Button>
                </div>
            ) : (
                <ScannerView />
            )}
        </Modal>
    );
});
