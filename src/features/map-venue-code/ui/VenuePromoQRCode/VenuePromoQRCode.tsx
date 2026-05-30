import styles from './VenuePromoQRCode.module.scss';
import { Modal, QRCode, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useVenueQrCode } from '@/features/map-venue-code/hooks/useVenueQrCode.ts';

const VenuePromoQrCode = observer(() => {
    const { data, isLoading, clearQrCode } = useVenueQrCode();
    const isOpen = isLoading || !!data?.qrPayload;

    return (
        <Modal
            open={isOpen}
            footer={null}
            onCancel={clearQrCode}
            destroyOnHidden
            className={styles['qr-modal']}
        >
            <div className={styles['qr-modal__wrapper']}>
                {isLoading ? (
                    <Spin />
                ) : (
                    data?.qrPayload && (
                        <>
                            <QRCode
                                value={data?.qrPayload}
                                className={styles['qr-modal__qrcode']}
                            />
                            <h2 className={styles['qr-modal__title']}>
                                Покажи QR код в заведении, чтобы получить скидку
                            </h2>
                            <p className={styles['qr-modal__description']}>
                                Код обновляется каждые 2 минуты с момента
                                открытия
                            </p>
                        </>
                    )
                )}
            </div>
        </Modal>
    );
});

export default VenuePromoQrCode;
