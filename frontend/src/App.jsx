// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Navbar from './components/layout/Navbar';
import MyLists from './pages/MyLists';
import Practice from './pages/Practice';
import PracticeQuestion from './pages/PracticeQuestion';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Bookmarks from './pages/Bookmarks';
import ListDetails from './pages/ListDetails';
import DashboardLayout from './components/layout/DashboardLayout';
import "./styles/index.css";

// ─── Auth helpers ───
const isAuthenticated = () => !!localStorage.getItem('token');

// ─── Route guards ───
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── Layout for public pages (with Navbar) ───
const PublicLayout = ({ children }) => (
  <div>
    <Navbar />
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>{children}</div>
  </div>
);

// ─── App ───
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC PAGES */}
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <PublicLayout><Landing /></PublicLayout>
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <PublicLayout><Login /></PublicLayout>
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <PublicLayout><Register /></PublicLayout>
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <PublicLayout><Register /></PublicLayout>
            </PublicOnlyRoute>
          }
        />

        {/* AUTHENTICATED PAGES */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/lists" element={<MyLists />} />
          <Route path="/lists/:id" element={<ListDetails />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:questionId" element={<PracticeQuestion />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Route>

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;