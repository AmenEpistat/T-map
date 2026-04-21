import { FireFilled } from '@ant-design/icons';
import {
    EntertainmentFilled,
    FoodOutlined,
    ShoppingFilled,
} from '@/features/map/components/LayerFilter/components/ui';

export const CATEGORY_UI = {
    food: { label: 'Еда', icon: <FoodOutlined /> },
    entertainment: { label: 'Развлечения', icon: <EntertainmentFilled /> },
    shopping: { label: 'Шоппинг', icon: <ShoppingFilled /> },
};

export const LAYER_UI = {
    anomalies: { label: 'Аномалии', icon: <FireFilled /> },
};
