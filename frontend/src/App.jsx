import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Navbar from './components/layout/Navbar'; 
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import MyLists from './pages/MyLists';
import CreateList from './pages/CreateList';
import Practice from './pages/Practice';
import Progress from './pages/Progress';
import Login from './pages/Login';
import Register from './pages/Register';
import "./styles/index.css";

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      {/* 1. Global Navbar - Added Here! */}
      <Navbar />
      
      {/* 2. Global Padding Container - Prevents the fixed navbar from covering content */}
      <div style={{ paddingTop: '64px', minHeight: '100vh', width: '100%' }}>
        <Routes>
          {/* Public Routes (No Sidebar) */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes (Wrapped in Sidebar Layout) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/lists" element={<MyLists />} />
            <Route path="/create-list" element={<CreateList />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;