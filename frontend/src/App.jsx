import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";

// Pages & Components
import Login from "./components/auth/LoginForm";
import Signup from "./components/auth/RegisterForm";
import AdminDashboard from "./components/admin/Dashboard";
import StoreListPage from "./components/store/StoreListPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";

// 🔒 Protected Route Component
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // While user state is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        Loading...
      </div>
    );
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed → redirect to unauthorized page
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// 🚀 Main App
export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role-based Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute roles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["user", "admin", "owner"]}>
                <StoreListPage />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Page (Optional) */}
          <Route
            path="/unauthorized"
            element={
              <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                  Access Denied
                </h1>
                <p className="text-gray-600">
                  You don’t have permission to view this page.
                </p>
              </div>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
