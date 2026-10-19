// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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
import Signup from './pages/Signup';
import "./styles/index.css";
import ListDetails from './pages/ListDetails';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Reusable public layout (Navbar + top padding)
const PublicLayout = () => (
  <div>
    <Navbar />
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================================
             1. PUBLIC ROUTES
             ========================================= */}
          <Route element={<PublicRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>

          {/* =========================================
             2. PROTECTED ROUTES
             ========================================= */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/lists" element={<MyLists />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/lists/:id" element={<ListDetails />} />
              <Route path="/practice/:questionId" element={<PracticeQuestion />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Landing />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;