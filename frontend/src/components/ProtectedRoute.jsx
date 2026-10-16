// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While we're checking the saved token, show nothing (or a spinner).
  // This prevents the Login page from flashing before the Dashboard.
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-app, #080B12)',
          color: 'var(--text-secondary, #8FA0B8)',
          fontSize: '14px',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Remember where the user was trying to go so we can send them back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;