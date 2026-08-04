import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";

// import { Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import MyLists from "./pages/MyLists";
import CreateList from "./pages/CreateList";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";

import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (

    <BrowserRouter>


      <Routes>
        
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

        {/* Public Pages */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />


        {/* Questions */}

        <Route
          path="/questions"
          element={
            <DashboardLayout>
              <Questions />
            </DashboardLayout>
          }
        />


        {/* My Lists */}

        <Route
          path="/my-lists"
          element={
            <DashboardLayout>
              <MyLists />
            </DashboardLayout>
          }
        />


        {/* Create List */}

        <Route
          path="/create-list"
          element={
            <DashboardLayout>
              <CreateList />
            </DashboardLayout>
          }
        />


        {/* Practice */}

        <Route
          path="/practice"
          element={
            <DashboardLayout>
              <Practice />
            </DashboardLayout>
          }
        />


        {/* Progress */}

        <Route
          path="/progress"
          element={
            <DashboardLayout>
              <Progress />
            </DashboardLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;