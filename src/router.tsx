import { createBrowserRouter } from 'react-router-dom';
import AichatPage from './pages/aichat/page';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AichatPage />,
  },
  // {
  //   path: '/',
  //   element: <Outlet />,
  //   children: [
  //     {
  //       index: true,
  //       element: <DashboardPage />,
  //     },
  //   ],
  // },
]); 