import { FireFilled } from '@ant-design/icons';
import {
    EntertainmentFilled,
    FoodFilled,
    ShoppingFilled,
} from '@/features/map/ui/LayerFilter/components/Icons';

export const CATEGORY_UI = {
    food: { label: 'Еда', icon: <FoodFilled /> },
    entertainment: { label: 'Развлечения', icon: <EntertainmentFilled /> },
    shopping: { label: 'Шоппинг', icon: <ShoppingFilled /> },
};

export const LAYER_UI = {
    anomalies: { label: 'Аномалии', icon: <FireFilled /> },
};
