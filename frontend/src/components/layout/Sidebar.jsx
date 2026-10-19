import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaList, FaCode, FaBookmark, FaFire } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  
  const [streak, setStreak] = useState(0);
  const [loadingStreak, setLoadingStreak] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) return;
      try {
        const res = await api.get('/progress/streak');
        if (res.data.success) {
          setStreak(res.data.streak);
        }
      } catch (err) {
        console.error("Failed to load streak", err);
      } finally {
        setLoadingStreak(false);
      }
    };

    fetchStreak();

    // Listen for the custom event dispatched by the Dashboard
    const handleStreakUpdate = () => {
      fetchStreak();
    };
    window.addEventListener('streak-updated', handleStreakUpdate);

    return () => {
      window.removeEventListener('streak-updated', handleStreakUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    if (onClose) onClose();
    navigate('/', { replace: true });
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
        <span style={{ fontWeight: "bold", color: "var(--text-primary)" }}>
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
        <NavLink to="/dashboard" style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
            background: isActive ? "rgba(124, 77, 255, 0.15)" : "transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: "none",
          })}>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/questions" style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
            background: isActive ? "rgba(124, 77, 255, 0.15)" : "transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: "none",
          })}>
          <FaList /> Questions
        </NavLink>

        <NavLink to="/lists" style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
            background: isActive ? "rgba(124, 77, 255, 0.15)" : "transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: "none",
          })}>
          <FaList /> My Lists
        </NavLink>

        <NavLink to="/practice" style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
            background: isActive ? "rgba(124, 77, 255, 0.15)" : "transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: "none",
          })}>
          <FaCode /> Practice
        </NavLink>

        <NavLink to="/bookmarks" style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
            background: isActive ? "rgba(124, 77, 255, 0.15)" : "transparent",
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: "none",
          })}>
          <FaBookmark /> Bookmarks
        </NavLink>
      </nav>

      {/* Streak & Logout */}
      <div style={{ marginTop: "auto", padding: "16px 12px" }}>
        <div style={{
            background: "rgba(124, 77, 255, 0.1)", borderRadius: "10px",
            padding: "12px", border: "1px solid rgba(124, 77, 255, 0.3)",
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Current Streak</span>
            <FaFire style={{ color: streak > 0 ? "#f97316" : "var(--text-secondary)" }} />
          </div>
          <div style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: "bold" }}>
            {loadingStreak ? "..." : `${streak} ${streak === 1 ? 'day' : 'days'}`}
          </div>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>
            {streak > 0 ? "Keep it up!" : "Solve to start!"}
          </span>
        </div>

        <button onClick={handleLogout} style={{
            marginTop: '12px', width: '100%', padding: '8px',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px', color: '#ef4444', fontWeight: '500',
            fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;