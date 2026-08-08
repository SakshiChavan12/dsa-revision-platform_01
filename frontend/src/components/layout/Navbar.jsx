import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaCode, FaSun, FaMoon, FaBars } from 'react-icons/fa6';
import { useState } from 'react';

// ADDED: Accept onMenuClick prop (for the dashboard sidebar to use)
const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); // <-- Check the current route
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'My Lists', path: '/lists' },
    { name: 'Practice', path: '/practice' },
    { name: 'Stats', path: '/progress' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 1. Logic to hide links specifically on the landing page
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="navbar" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, height: '64px',
      zIndex: 1000,
      background: 'var(--bg-nav)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      transition: 'background 0.3s ease'
    }}>
      
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', textDecoration: 'none' }}>
        <FaCode style={{ color: 'var(--accent-purple)', fontSize: '20px' }} />
        <span style={{ fontWeight: 700, fontSize: '18px' }}>DSA Trainer</span>
      </Link>

      {/* 2. CONDITIONALLY RENDERED CENTER LINKS */}
      {!isLandingPage && (
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="desktop-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
                paddingBottom: '4px',
                borderBottom: isActive ? `2px solid var(--accent-purple)` : 'none',
                transition: 'color 0.2s'
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}

      {/* Right Actions (Always visible) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px' }}
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
        
        <div style={{ display: 'flex', gap: '12px' }} className="auth-buttons">
          <Link to="/login" className="btn-outline" style={{ padding: '6px 16px', fontSize: '14px' }}>Login</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '6px 16px', fontSize: '14px' }}>Sign Up</Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={onMenuClick || toggleMenu} 
          aria-label="Open navigation menu" 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'none' }} 
          className="mobile-burger"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div style={{ position: 'absolute', top: '64px', left: 0, right: 0, background: 'var(--bg-nav)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px' }} className="mobile-menu">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} style={({ isActive }) => ({ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none' })} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </NavLink>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <Link to="/login" className="btn-outline" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;