import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { storeUserSession } from '../utils/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({ email, password });
      storeUserSession(data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <div className="mb-8 rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 px-6 py-8 text-white shadow-inner">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 max-w-xl text-slate-200">Login to access student, company, and admin features.</p>
      </div>
      {message && <p className="mb-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Email</span>
          <input
            type="email"
            className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Password</span>
          <input
            type="password"
            className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800">
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New user?{' '}
        <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
