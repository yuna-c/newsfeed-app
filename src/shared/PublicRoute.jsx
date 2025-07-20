import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);
  // 현재 라우터의 경로 가져오기
  const location = useLocation();
  const fromSignUp = location.state?.fromSignUp;

  if (user && !fromSignUp) {
    return <Navigate to="/" replace />;
  }

  return children;
}
