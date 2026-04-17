import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import '../shared/styles/global.scss';

function App() {
    return <RouterProvider router={router} />;
}
export default App;
