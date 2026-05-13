import styles from './CloseButton.module.scss';
import { classNames } from '@/shared/utils/classNames.ts';
import { Button } from 'antd';
import { CaretLeftFilled } from '@ant-design/icons';
import CloseFilled from '@/shared/ui/Icons/CloseFilled/CloseFilled.tsx';

interface Props {
    onClose?: () => void;
    isMobile?: boolean;
}

const CloseButton = ({ onClose, isMobile }: Props) => {
    return (
        <Button
            type='text'
            onClick={onClose}
            className={classNames(!isMobile && styles['close-button'])}
        >
            {isMobile ? <CloseFilled /> : <CaretLeftFilled />}
        </Button>
    );
};

export default CloseButton;
