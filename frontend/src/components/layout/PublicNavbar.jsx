// src/components/layout/PublicNavbar.jsx
import { Link, NavLink } from 'react-router-dom';

const PublicNavbar = () => {
  const navLinks = [
    { name: "My Lists", path: "/lists" },
    { name: "Practice", path: "/practice" },
    { name: "Stats", path: "/progress" }, // Assuming Progress maps to Stats
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#0B0C10]/80 backdrop-blur-md border-b border-[#2D2D3D] h-16 flex items-center shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-[#7C5CFC] text-xl font-mono font-bold">{`</>`}</span>
          <span className="text-white font-semibold text-lg tracking-tight">DSA Revision</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 relative pb-1
                ${isActive ? "text-white border-b-2 border-[#7C5CFC]" : "text-[#9CA3AF] hover:text-white"}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-[#7C5CFC] to-[#6B5CE7] text-white rounded-lg transition-all hover:opacity-90 hover:shadow-[0_0_15px_rgba(124,92,252,0.4)] hidden sm:inline-block"
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;