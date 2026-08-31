// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. DISPLAY: GRID keeps Sidebar left and Main right
  // 2. NO FLEX, NO ALIGN-ITEMS, NO JUSTIFY-CONTENT (Removes all centering)
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: '230px 1fr',
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-app)',
    },
    main: {
      height: '100vh',
      overflowY: 'auto',
      padding: '24px 28px 40px', // Perfect professional top padding
      background: 'var(--bg-app)',
      boxSizing: 'border-box',
    }
  };

  return (
    <div style={styles.container} className="dashboard-layout-root">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main style={styles.main} className="dashboard-main-content">
        {/* 3. REMOVED margin: '0 auto' - This was centering the content weirdly */}
        <div style={{ width: '100%', maxWidth: '1500px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;