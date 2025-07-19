import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <ul className="flex items-start justify-center gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/mypage">Mypage</Link>
        </li>
        <li>
          <Link to="/signin">SignIn</Link>
        </li>
        <li>
          <button>SignOut</button>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
