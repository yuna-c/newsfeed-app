import Home from '../pages/Home';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import EditPost from '../pages/post/EditPost';
import WritePost from '../pages/post/WritePost';
import DetailPost from '../pages/post/DetailPost';
import Layout from '../components/layouts/Layout';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const Router = () => {
  // ✅ 1. 누구나 접근 가능한 라우트
  const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/detailpost/:id', element: <DetailPost /> },
    {
      path: '/signin',
      element: (
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      )
    },
    {
      path: '/signup',
      element: (
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      )
    }
  ];

  // ✅ 2. 로그인한 사용자만 접근 가능한 라우트
  const protectedRoutes = [
    {
      path: '/',
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
      children: [...publicRoutes, ...protectedRoutes, notFound]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
