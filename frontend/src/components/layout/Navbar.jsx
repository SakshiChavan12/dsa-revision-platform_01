// import { Link, NavLink, useLocation } from 'react-router-dom';
// import { useTheme } from '../../context/ThemeContext';
// import { FaCode, FaSun, FaMoon, FaBars } from 'react-icons/fa6';
// import { useState } from 'react';

// const Navbar = ({ onMenuClick }) => {
//   const { theme, toggleTheme } = useTheme();
//   const location = useLocation(); // <-- 1. Get current route
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // 2. Define the array of navigation links
//   const navLinks = [
   
//   ];

//   // 3. Check if we are on a login/signup page to hide the links
//   const isAuthPage = 
//     location.pathname === '/login' || 
//     location.pathname === '/signup';

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <nav className="navbar" style={{
//       position: 'fixed',
//       top: 0, left: 0, right: 0, height: '64px',
//       zIndex: 1000,
//       background: 'var(--bg-nav)',
//       borderBottom: '1px solid var(--border-subtle)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: '0 24px',
//       transition: 'background 0.3s ease'
//     }}>
      
//       {/* Left: Logo (Always visible) */}
//       <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', textDecoration: 'none' }}>
//         <FaCode style={{ color: 'var(--accent-purple)', fontSize: '20px' }} />
//         <span style={{ fontWeight: 700, fontSize: '18px' }}>DSA Trainer</span>
//       </Link>

//       {/* Center: Navigation Links (Conditionally rendered) */}
//       {!isAuthPage && (
//         <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="desktop-links">
//           {navLinks.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.path}
//               style={({ isActive }) => ({
//                 color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
//                 textDecoration: 'none',
//                 fontWeight: 500,
//                 position: 'relative',
//                 paddingBottom: '4px',
//                 borderBottom: isActive ? `2px solid var(--accent-purple)` : 'none',
//                 transition: 'color 0.2s'
//               })}
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </div>
//       )}

//       {/* Right: Actions (Always visible) */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//         <button
//           onClick={toggleTheme}
//           aria-label="Toggle theme"
//           style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px' }}
//         >
//           {theme === 'dark' ? <FaSun /> : <FaMoon />}
//         </button>
        
//         <div style={{ display: 'flex', gap: '12px' }} className="auth-buttons">
//           <Link to="/login" className="btn-outline" style={{ padding: '6px 16px', fontSize: '14px' }}>Login</Link>
//           <Link to="/signup" className="btn-primary" style={{ padding: '6px 16px', fontSize: '14px' }}>Sign Up</Link>
//         </div>

//         {/* Mobile Hamburger - remains unchanged */}
//         <button 
//           onClick={onMenuClick || toggleMenu} 
//           aria-label="Open navigation menu" 
//           style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'none' }} 
//           className="mobile-burger"
//         >
//           <FaBars size={20} />
//         </button>
//       </div>

//       {/* Mobile Menu Overlay - remains unchanged */}
//       {isMenuOpen && (
//         <div style={{ position: 'absolute', top: '64px', left: 0, right: 0, background: 'var(--bg-nav)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px' }} className="mobile-menu">
//           {!isAuthPage && navLinks.map((link) => (
//             <NavLink key={link.name} to={link.path} style={({ isActive }) => ({ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none' })} onClick={() => setIsMenuOpen(false)}>
//               {link.name}
//             </NavLink>
//           ))}
//           <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
//             <Link to="/login" className="btn-outline" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
//             <Link to="/signup" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>Sign Up</Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();                    // clears context state + localStorage
    navigate('/login', { replace: true });
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--bg-card, #0D121C)',
        borderBottom: '1px solid var(--border-subtle, #252B38)',
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700 }}>
        DSA Trainer
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;