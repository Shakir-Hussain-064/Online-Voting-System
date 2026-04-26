import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const [form, setForm] = useState({
    voterId: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveSession(data.token, data.user);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/vote");
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-300/70 bg-white shadow-xl">
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-8 text-slate-100 sm:px-7 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Citizen Access</p>
          <h1 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl">National Election Portal</h1>
          <p className="mt-4 text-sm text-slate-300">
            Sign in with your voter credentials to access secure biometric voting and official election services.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">Verified voter identity workflow</p>
            <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">One citizen account, one ballot</p>
            <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">Real-time election record integrity</p>
          </div>
        </div>

        <div className="card-surface px-5 py-8 sm:px-7 sm:py-10">
          <h2 className="font-heading text-2xl font-semibold text-slate-900">Secure Login</h2>
          <p className="mt-1 text-sm text-slate-600">Enter your voter ID and password to continue.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              name="voterId"
              placeholder="Voter ID"
              value={form.voterId}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-700">
            New voter?{" "}
            <Link to="/register" className="font-semibold text-slate-900 underline decoration-slate-400 underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
