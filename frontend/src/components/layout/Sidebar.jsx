import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        DSA Revision
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/questions">
          📚 Questions
        </NavLink>

        <NavLink to="/my-lists">
          📋 My Lists
        </NavLink>

        <NavLink to="/create-list">
          ➕ Create List
        </NavLink>

        <NavLink to="/practice">
          🎯 Practice
        </NavLink>

        <NavLink to="/progress">
          📊 Progress
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;