import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CSS Variable reference for consistent theming
  const styles = {
    container: {
      display: 'grid',
      // Desktop: 230px sidebar, rest for main. Mobile: collapses to 1 column.
      gridTemplateColumns: '230px 1fr', 
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-app, #080b12)',
      overflow: 'hidden', // Prevents double scrollbars
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto', // Scroll only the main content
      padding: '28px 32px 40px', // Professional spacing
      background: 'var(--bg-app, #080b12)',
    }
  };

  return (
    // Responsive Media Query hack using inline style + class for mobile
    <div style={styles.container} className="dashboard-layout-root">
      
      {/* 1. Sidebar sits firmly on the left */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* 2. Main Dashboard Content sits on the right */}
      <main style={styles.main} className="dashboard-main-content">
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;