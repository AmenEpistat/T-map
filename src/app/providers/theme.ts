import type { ThemeConfig } from 'antd';
// Keep in sync with variables.scss
export const theme: ThemeConfig = {
    token: {
        colorPrimary: '#FFDD2D',
        colorText: '#141414',
        colorTextSecondary: '#9299A2',
        colorError: '#EB5757',
        colorErrorBg: '#FEE0E0',
        colorErrorBorder: '#FCE4E4',
        colorErrorBorderHover: '#FCE4E4',
        colorErrorOutline: 'transparent',
        colorLink: '#336FEE',
        colorLinkHover: '#336FEE',
        colorBgContainer: '#FFFFFF',
        colorBorder: '#ECF1F7',
        colorTextPlaceholder: '#6C6F71',

        colorSuccess: '#27AE60',
        colorSuccessBg: '#E6F4EA',
        colorSuccessBorder: '#27AE60',

        colorWarning: '#626262',
        colorWarningBg: '#FFDD2D',
        colorWarningBorder: '#FFE0A3',

        fontFamily:
            'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
        fontSize: 15,
        lineHeight: 24 / 15,
        borderRadius: 12,

        controlHeightLG: 56,
    },
    components: {
        Button: {
            colorPrimary: '#FFDD2D',
            colorPrimaryHover: '#F5D000',
            colorPrimaryActive: '#E6C800',
            primaryColor: '#141414',
            fontWeight: 400,
            paddingInlineLG: 25,
        },
        Input: {
            paddingBlockLG: 16,
            paddingInlineLG: 15,
            activeBorderColor: '#FFDD2D',
            hoverBorderColor: '#FFDD2D',
        },
    },
};
