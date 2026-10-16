// frontend/src/components/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

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

  // If already logged in, redirect to Dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;