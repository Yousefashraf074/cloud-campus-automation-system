import { Link, useNavigate } from 'react-router-dom';
import { getToken, getUserRole, getUserName, clearUserSession } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole();
  const name = getUserName();

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 border-b border-slate-200/70 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">C</span>
          <span>Campus Automation</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {!token ? (
            <>
              <Link to="/login" className="text-slate-700 hover:text-slate-900">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{name} ({role})</span>
              <button onClick={handleLogout} className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
