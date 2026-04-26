import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    voterId: "",
    password: "",
    role: "citizen"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setSuccess(data.message || "Registration successful");
      setTimeout(() => navigate("/login"), 900);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-300/70 bg-white shadow-xl">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-8 text-slate-100 sm:px-7 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Voter Onboarding</p>
          <h1 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl">Create Election Account</h1>
          <p className="mt-4 text-sm text-slate-300">
            Register your official voter profile to access the national biometric voting platform.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">Trusted digital identity registration</p>
            <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">Role-based election portal access</p>
            <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">Biometric-ready citizen account setup</p>
          </div>
        </div>

        <div className="card-surface px-5 py-8 sm:px-7 sm:py-10">
          <h2 className="font-heading text-2xl font-semibold text-slate-900">Sign Up</h2>
          <p className="mt-1 text-sm text-slate-600">Submit your details to register your account.</p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={onChange}
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <input
              name="voterId"
              placeholder="Voter ID"
              value={form.voterId}
              onChange={onChange}
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
            </select>

            {error && <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {success && <p className="md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-700">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-slate-900 underline decoration-slate-400 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
