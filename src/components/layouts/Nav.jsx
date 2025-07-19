import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaRegHeart } from 'react-icons/fa';

function Nav() {
  const navigate = useNavigate();
  const { user, signOut } = useContext(AuthContext);
  console.log(JSON.stringify(user));

  const onSignout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav>
      <ul className="flex items-start justify-center gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/mypage">Mypage</Link>
        </li>

        {user ? (
          <>
            <li>
              <button onClick={onSignout}>SignOut</button>
            </li>
            <li>
              <span className="flex items-center">
                {user.user_name} <FaRegHeart className="ml-1" />
              </span>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signin">SignIn</Link>
            </li>
            <li>
              <Link to="/signup">SignUp</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
