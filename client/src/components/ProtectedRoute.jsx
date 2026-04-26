import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/vote"} replace />;
  }

  return children;
};

export default ProtectedRoute;
