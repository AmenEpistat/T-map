import { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

export const useQrScanner = (onScan: (data: string) => void) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<QrScanner | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        scannerRef.current = new QrScanner(
            videoRef.current,
            (result) => onScan(result.data),
            { preferredCamera: 'environment' }
        );

        void scannerRef.current.start();

        return () => {
            scannerRef.current?.destroy();
            scannerRef.current = null;
        };
    }, []);

    return videoRef;
};
