import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const saveSession = (incomingToken, incomingUser) => {
    localStorage.setItem("token", incomingToken);
    setToken(incomingToken);
    setUser(incomingUser);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (_error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      saveSession,
      clearSession,
      isAuthenticated: Boolean(token)
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
