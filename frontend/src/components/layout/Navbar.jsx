import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaListUl, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logoutUser } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logoutUser(); // clears context state + localStorage
    navigate('/login', { replace: true });
  };

  // Generate initials from user's name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
      : name.substring(0, 2).toUpperCase();
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
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            
            {/* Avatar Trigger Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                outline: 'none'
              }}
              aria-label="Profile menu"
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-purple, #7C4DFF), #00bcd4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: isDropdownOpen ? '2px solid var(--text-primary)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {getInitials(user?.name)}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '240px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  zIndex: 101,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* User Info Header */}
                <div
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email}
                  </span>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '8px 0' }}>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    style={styles.menuItem}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaUser style={{ color: 'var(--text-secondary)' }} /> My Profile
                  </Link>
                  
                  <Link
                    to="/lists"
                    onClick={() => setIsDropdownOpen(false)}
                    style={styles.menuItem}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaListUl style={{ color: 'var(--text-secondary)' }} /> My Lists
                  </Link>
                </div>

                {/* Logout Section */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '8px 0' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      ...styles.menuItem,
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaSignOutAlt style={{ color: '#ef4444' }} /> 
                    <span style={{ color: '#ef4444' }}>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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

// Shared styles for dropdown items
const styles = {
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default Navbar;