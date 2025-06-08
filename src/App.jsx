import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Layout
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Pages requiring login */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <PrivateRoute>
            <MainLayout>
              <Reviews />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <PrivateRoute>
            <MainLayout>
              <Alerts />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Public pages */}
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
      <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />

      {/* Fallback */}
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  );
}

export default App;
