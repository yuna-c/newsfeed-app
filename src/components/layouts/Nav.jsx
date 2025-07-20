import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaRegHeart } from 'react-icons/fa';
import { supabase } from '../../supabase/Client';
import toast from 'react-hot-toast';

function Nav() {
  const navigate = useNavigate();
  const { user, signOut } = useContext(AuthContext);

  const onSignout = async () => {
    await signOut();
    navigate('/');
  };

  const onResign = async () => {
    if (!user) return;
    const configDelete = window.confirm('회원 탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!configDelete) return;

    try {
      const { _data, error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);

      if (profileError) {
        console.error(profileError);
        return;
      }

      await signOut();
      toast.success('탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (err) {
      console.error('회원 탈퇴 실패', err);
      toast.error('알 수 없는 오류로 인한 회원 탈퇴 실패');
    }
  };

  return (
    <nav>
      <ul className="flex items-center justify-center gap-4">
        <li>
          <Link to="/">홈</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/mypage">마이페이지</Link>
            </li>
            <li>
              <Link to="/writepost">글쓰기</Link>
            </li>
            <li>
              <span className="flex items-center h-full">
                {user.user_name} <FaRegHeart className="ml-1" />
              </span>
            </li>
            <li>
              <button
                onClick={onSignout}
                className="inline-flex justify-center px-3 py-1 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                로그아웃
              </button>
            </li>
            <li>
              <button
                onClick={onResign}
                className="inline-flex justify-center px-3 py-1 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                회원탈퇴
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signin">로그인</Link>
            </li>
            <li>
              <Link to="/signup">회원가입</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
