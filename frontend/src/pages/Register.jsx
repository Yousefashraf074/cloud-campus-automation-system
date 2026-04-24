import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { storeUserSession } from '../utils/auth';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    companyName: '',
    location: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await register(form);
      storeUserSession(data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[32px] bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <div className="mb-8 rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 px-6 py-8 text-white shadow-inner">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 max-w-xl text-slate-200">Register as a student, company, or admin to manage your campus placements.</p>
      </div>
      {message && <p className="mb-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        {form.role === 'company' && (
          <label className="block">
            <span className="text-sm font-medium text-slate-900">Company Name</span>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required={form.role === 'company'}
              className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Location</span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <button type="submit" className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800">
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
