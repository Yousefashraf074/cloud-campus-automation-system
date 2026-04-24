import { useEffect, useState } from 'react';
import { getAllUsers, fetchJobs } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getAllUsers().then((response) => setUsers(response.data)).catch(() => {});
    fetchJobs({ status: 'open' }).then((response) => setJobs(response.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Oversee users, companies, and job postings from one centralized, polished interface.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Users</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{users.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jobs</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Activity</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Live</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <h3 className="mb-6 text-xl font-semibold text-slate-900">Registered Users</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">No users found yet.</div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                <p className="mt-1 text-sm text-slate-600">{user.role}</p>
                <p className="mt-2 text-sm text-slate-500">{user.email}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <h3 className="mb-6 text-xl font-semibold text-slate-900">Open Jobs</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">No open jobs available.</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">{job.title}</p>
                <p className="mt-1 text-sm text-slate-600">{job.companyName}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
