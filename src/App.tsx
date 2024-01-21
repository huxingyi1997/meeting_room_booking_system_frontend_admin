import React from 'react';
import { Skeleton } from 'antd';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Index = React.lazy(() => import('./pages/Index'));
const Menu = React.lazy(() => import('./pages/Menu'));

const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));
const Login = React.lazy(() => import('./pages/Login'));
const UserManage = React.lazy(() => import('./pages/UserManage'));

const routes = [
  {
    path: '/',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Menu></Menu>,
        children: [
          {
            path: 'user_manage',
            element: <UserManage />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
];

export const router = createBrowserRouter(routes);

const App = () => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default App;
