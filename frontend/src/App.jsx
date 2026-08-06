import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

import MyLists from "./pages/MyLists";
import CreateList from "./pages/CreateList";

import Practice from "./pages/Practice";
import PracticeQuestion from "./pages/PracticeQuestion";

import Progress from "./pages/Progress";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";

import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>

      {/* Public Navbar */}
      <Navbar />

      <div
        style={{
          paddingTop: "64px",
          minHeight: "100vh",
          width: "100%",
        }}
      >

        <Routes>

          {/* =========================
              PUBLIC PAGES
          ========================= */}

          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =========================
              DASHBOARD PAGES
          ========================= */}

          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/lists"
              element={<MyLists />}
            />

            <Route
              path="/create-list"
              element={<CreateList />}
            />

            {/* Practice selection page */}
            <Route
              path="/practice"
              element={<Practice />}
            />

            {/* Individual question page */}
            <Route
              path="/practice/:questionId"
              element={<PracticeQuestion />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

          </Route>

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;