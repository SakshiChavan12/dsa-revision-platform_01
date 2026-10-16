// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentUser, logout as authLogout } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we verify the saved session

  // ── Restore session on app startup ──
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate the token with the backend. If it's expired/invalid, this throws.
        const data = await getCurrentUser();
        // Backend may return { user } or just the user object. Handle both.
        const currentUser = data?.user || data;
        setUser(currentUser);
        // Keep localStorage user in sync
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (err) {
        // Token is invalid or expired — clear it
        authLogout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Called by Login/Signup after a successful response
  const loginUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Called by Logout button / navbar
  const logoutUser = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};