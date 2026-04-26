import axios from "axios";

const normalizeBaseUrl = (rawUrl) => {
  const trimmed = (rawUrl || "").trim();

  if (!trimmed) {
    return "http://localhost:5000/api";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
};

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
