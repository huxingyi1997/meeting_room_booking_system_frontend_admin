import React from 'react';
import { Skeleton } from 'antd';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Index = React.lazy(() => import('./pages/Index'));
const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));

const Menu = React.lazy(() => import('./pages/Menu'));
const UserManage = React.lazy(() => import('./pages/UserManage'));
const MeetingRoomManage = React.lazy(() => import('./pages/MeetingRoomManage'));
const BookingManage = React.lazy(() => import('./pages/BookingManage'));
const Statistics = React.lazy(() => import('./pages/Statistics'));

const ModifyMenu = React.lazy(() => import('./pages/ModifyMenu'));
const InfoModify = React.lazy(() => import('./pages/InfoModify'));
const PasswordModify = React.lazy(() => import('./pages/PasswordModify'));

const Login = React.lazy(() => import('./pages/Login'));

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
            path: '/',
            element: <MeetingRoomManage />,
          },
          {
            path: 'user_manage',
            element: <UserManage />,
          },
          {
            path: 'meeting_room_manage',
            element: <MeetingRoomManage />,
          },
          {
            path: 'booking_manage',
            element: <BookingManage />,
          },
          {
            path: 'statistics',
            element: <Statistics />,
          },
        ],
      },
      {
        path: '/user',
        element: <ModifyMenu></ModifyMenu>,
        children: [
          {
            path: 'info_modify',
            element: <InfoModify />,
          },
          {
            path: 'password_modify',
            element: <PasswordModify />,
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
