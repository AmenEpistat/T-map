import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { router } from './router/router.tsx';
import { theme } from './providers/theme.ts';
import './styles/global.scss';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/features/auth';
import { Splash } from '@/shared/ui';
import { setupStores } from './providers/setupStores.ts';

const App = observer(() => {
    useEffect(() => {
        setupStores();
        void authStore.initialize();
    }, []);

    return (
        <ConfigProvider theme={theme} locale={ruRU}>
            {authStore.isInitializing ? (
                <Splash />
            ) : (
                <RouterProvider router={router} />
            )}
        </ConfigProvider>
    );
});

export default App;
