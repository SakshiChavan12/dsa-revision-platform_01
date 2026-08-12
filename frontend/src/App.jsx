import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Navbar from './components/layout/Navbar';
import MyLists from './pages/MyLists';
import Practice from './pages/Practice';
import PracticeQuestion from './pages/PracticeQuestion';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import "./styles/index.css";
import Questions from './pages/Questions';
import Bookmarks from './pages/Bookmarks';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

const AppLayout = () => {
  const location = useLocation();

  // Define paths where the Navbar should be HIDDEN
  const hideNavbarPaths = [
    '/dashboard', // <-- Added dashboard to the hidden list
    '/lists',
    '/practice',
    '/progress',
  ];

  // Check if current path matches an exact hide path, OR starts with /practice/ 
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname) ||
    location.pathname.startsWith('/practice/');

  return (
    <div className="app-wrapper">
      {/* Conditionally render the navbar */}
      {!shouldHideNavbar && <Navbar />}

      {/* Adjust wrapper padding based on whether navbar is showing */}
      <div style={{ paddingTop: shouldHideNavbar ? '0px' : '64px', minHeight: '100vh', width: '100%' }}>
        <Routes>
          {/* Public Routes (Shows Navbar) */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes (Wrapped in Sidebar Layout - Hides Navbar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/questions" element={<Questions />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lists" element={<MyLists />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/:questionId" element={<PracticeQuestion />} />
            <Route path="/progress" element={<Progress />} />
          </Route>

          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;