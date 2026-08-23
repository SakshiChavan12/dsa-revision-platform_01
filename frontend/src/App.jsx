// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
           1. PUBLIC ROUTES (WITH NAVBAR)
           ========================================= */}
        <Route 
          path="/" 
          element={
            <div>
              <Navbar />
              <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
                <Landing />
              </div>
            </div>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <div>
              <Navbar />
              <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
                <Login />
              </div>
            </div>
          } 
        />

        <Route 
          path="/signup" 
          element={
            <div>
              <Navbar />
              <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
                <Signup />
              </div>
            </div>
          } 
        />

        {/* =========================================
           2. AUTHENTICATED ROUTES (SIDEBAR ONLY)
           ========================================= */}
        {/* DashboardLayout contains ONLY the Sidebar + Main Content. NO Navbar here! */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/lists" element={<MyLists />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/lists/:id" element={<ListDetails />} />
          <Route path="/practice/:questionId" element={<PracticeQuestion />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          {/* Add /notes and /settings here if their components exist */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;