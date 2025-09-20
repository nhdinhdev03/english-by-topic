import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicRoutes } from '../../Router';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h2>English by Topic</h2>
        </Link>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {publicRoutes.map((route, index) => (
              <li key={index} className="nav-item">
                <Link 
                  to={route.path} 
                  className={`nav-link ${isActiveRoute(route.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button 
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;