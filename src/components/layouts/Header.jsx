import { Link } from 'react-router-dom';
import { CgAlbum } from 'react-icons/cg';
import Nav from './Nav';

function Header() {
  return (
    <header className="p-4 border-b border-gray-300">
      <aside className="flex items-center justify-between ">
        <h1 className="text-2xl font-semibold">
          <Link to="/">
            <CgAlbum />
          </Link>
        </h1>
        <Nav />
      </aside>
    </header>
  );
}

export default Header;
