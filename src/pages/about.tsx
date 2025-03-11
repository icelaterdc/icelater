import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav>
      <Link to="/">Ana Sayfa</Link>
      <Link to="/about">Hakkımda</Link>
    </nav>
  );
};
