import { NavLink, useNavigate } from "react-router-dom"; // <-- Added useNavigate
import {
  FaHome,
  FaList,
  FaCode,
  FaChartLine,
  FaBookmark,
  FaStickyNote,
  FaCog,
  FaFire
} from "react-icons/fa";
import { logout } from "../../services/auth"; // <-- Import the logout helper we created earlier

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Hook to redirect user

  // Handle Logout
  const handleLogout = () => {
    logout(); // 1. Clear localStorage
    navigate('/login'); // 2. Redirect to login page
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <FaCode style={{ color: "var(--accent-purple)" }} />

        <span
          style={{
            fontWeight: "bold",
            color: "var(--text-primary)",
          }}
        >
          DSA Trainer
        </span>
       </div>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "16px 12px",
          flex: 1,
        }}
      >

        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/questions"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaList />
          Questions
        </NavLink>

        <NavLink
          to="/lists"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaList />
          My Lists
        </NavLink>

        <NavLink
          to="/practice"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaCode />
          Practice
        </NavLink>

        <NavLink
          to="/progress"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaChartLine />
          Progress
        </NavLink>

        <NavLink
          to="/bookmarks"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px',
            background: isActive ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            textDecoration: 'none', transition: 'all 0.2s'
          })}
        >
          <FaBookmark /> Bookmarks
        </NavLink>

        <NavLink
          to="/notes"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaStickyNote />
          Notes
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: isActive
              ? "rgba(124, 77, 255, 0.15)"
              : "transparent",
            color: isActive
              ? "var(--text-primary)"
              : "var(--text-secondary)",
            textDecoration: "none",
          })}
        >
          <FaCog />
          Settings
        </NavLink>

      </nav>

      {/* Streak & Logout */}
      <div style={{ marginTop: "auto", padding: "16px 12px" }}>
        <div
          style={{
            background: "rgba(124, 77, 255, 0.1)",
            borderRadius: "10px",
            padding: "12px",
            border: "1px solid rgba(124, 77, 255, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.75rem",
              }}
            >
              Current Streak
            </span>

            <FaFire style={{ color: "#f97316" }} />
          </div>

          <div
            style={{
              color: "var(--text-primary)",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            12 days
          </div>

          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.7rem",
            }}
          >
            Keep it up!
          </span>
        </div>

        {/* --- NEW LOGOUT BUTTON --- */}
        <button 
          onClick={handleLogout}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            fontWeight: '500',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;