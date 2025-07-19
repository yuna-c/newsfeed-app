// import { useContext } from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { AuthContext } from '../context/Providers';
// import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  //   const { user } = authContext(UserContext);
  //   const { pathname } = useLocation();
  //   // 🔐 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  //   // - replace: 히스토리 스택에 남기지 않음 (뒤로가기 막음)
  //   // - state: 로그인 성공 시 원래 요청 경로로 되돌리기 위해 현재 경로 저장
  //   if (!user) {
  //     return <Navigate to="/signin" replace state={{ redirectedFrom: pathname }} />;
  //   }
  //   // ✅ 인증된 사용자는 하위 라우트 렌더링
  return <Outlet />;
}
