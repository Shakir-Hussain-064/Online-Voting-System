import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-300/70 bg-slate-950/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <Link
          to={user?.role === "admin" ? "/admin" : "/vote"}
          className="font-heading text-base font-bold tracking-wide text-slate-100 sm:text-lg"
        >
          National Election Portal
        </Link>
        <div className="flex w-full items-center justify-between gap-3 text-sm md:w-auto md:justify-end">
          {user && (
            <span className="max-w-[65vw] truncate rounded-full border border-slate-500/50 bg-slate-800 px-3 py-1 font-medium capitalize text-slate-100 md:max-w-none">
              {user.name} ({user.role})
            </span>
          )}
          <button
            onClick={logout}
            className="whitespace-nowrap rounded-lg border border-slate-500/70 bg-slate-700 px-3 py-2 font-semibold text-white transition hover:bg-slate-600"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
