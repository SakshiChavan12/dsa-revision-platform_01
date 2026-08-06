import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// REMOVED: import Navbar from './Navbar'; <-- Remove this
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* REMOVED: <Navbar onMenuClick={() => setSidebarOpen(true)} /> */}
        
        {/* Adjusted Padding: We removed the Navbar from here, but we still need spacing from the global fixed navbar at the top */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-20"> 
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;