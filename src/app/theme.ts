import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
    token: {
        colorPrimary: '#FFDD2D',
        colorText: '#141414',
        colorTextSecondary: '#9299A2',
        colorError: '#FF3B30',
        fontFamily:
            '\'Roboto\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif',
        fontSize: 15,
        borderRadius: 12,
    },
    components: {
        Button: {
            colorPrimary: '#FFDD2D',
            colorPrimaryHover: '#F5D000',
            colorPrimaryActive: '#E6C800',
            primaryColor: '#141414',
            fontWeight: 400,
        },
    },
};
