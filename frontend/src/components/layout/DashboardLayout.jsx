import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">

      <Navbar />

      <div className="dashboard-body">

        <Sidebar />

        <main className="main-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;