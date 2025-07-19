import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import EditPost from '../pages/post/EditPost';
import WritePost from '../pages/post/WritePost';
import DetailPost from '../pages/post/DetailPost';
import Layout from '../components/layouts/Layout';

const Router = () => {
  // ✅ 1. 누구나 접근 가능한 라우트
  const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/detailpost/:id', element: <DetailPost /> },
    { path: '/signin', element: <SignIn /> },
    { path: '/signup', element: <SignUp /> }
  ];

  // ✅ 2. 로그인한 사용자만 접근 가능한 라우트
  const privateRoutes = [
    {
      path: '/user',
      element: <ProtectedRoute />,
      children: [
        { path: 'mypage', element: <MyPage /> },
        { path: 'writepost', element: <WritePost /> },
        { path: 'editpost/:id', element: <EditPost /> }
      ]
    }
  ];

  // ✅ Not Found
  const notFound = {
    path: '*',
    element: <Navigate to="/" />
  };

  // ✅ 라우터 설정
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [...publicRoutes, ...privateRoutes, notFound]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
