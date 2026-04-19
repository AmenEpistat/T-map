import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { router } from './router.tsx';
import { theme } from './theme';
import '../shared/styles/global.scss';

function App() {
    return (
        <ConfigProvider theme={theme} locale={ruRU}>
            <RouterProvider router={router} />
        </ConfigProvider>
    );
}

export default App;
