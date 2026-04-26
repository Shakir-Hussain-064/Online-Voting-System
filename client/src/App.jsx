import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vote from "./pages/Vote";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {isAuthenticated && <Navbar />}
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/vote"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <Vote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? (user?.role === "admin" ? "/admin" : "/vote") : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
