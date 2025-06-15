import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/dashboard/page';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
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