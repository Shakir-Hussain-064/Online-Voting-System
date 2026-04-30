import axios from "axios";

const normalizeProtocol = (urlString) => {
  try {
    const url = new URL(urlString);
    const isSecurePage = typeof window !== "undefined" && window.location.protocol === "https:";

    // Prevent mixed-content failures when app runs on HTTPS.
    if (isSecurePage && url.protocol === "http:") {
      url.protocol = "https:";
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return (urlString || "").replace(/\/+$/, "");
  }
};

const normalizeBaseUrl = (rawUrl) => {
  const trimmed = (rawUrl || "").trim();

  if (!trimmed) {
    return "https://online-voting-system-2tni.onrender.com/api";
  }

  const withoutTrailingSlash = normalizeProtocol(trimmed);
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
