import { useEffect, useState } from 'react';
import { fetchJobs, createJob, getCompanyApplications, updateApplicationStatus } from '../services/api';
import JobCard from '../components/JobCard';

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobForm, setJobForm] = useState({ title: '', description: '', location: '', type: 'Internship', salary: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs({})
      .then((response) => setJobs(response.data.filter((job) => job.company?._id)))
      .catch(() => {});
    getCompanyApplications().then((response) => setApplications(response.data)).catch(() => {});
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createJob(jobForm);
      setJobs((prev) => [data, ...prev]);
      setMessage('Job posted successfully');
      setJobForm({ title: '', description: '', location: '', type: 'Internship', salary: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Job create failed');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, { status });
      setApplications((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Company Dashboard</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Post job openings quickly and manage incoming applications from a central workspace.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Jobs</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Applicants</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{applications.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Real-time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Create New Job</h3>
            <p className="text-sm text-slate-500">Share openings with students and track applicant flow.</p>
          </div>
          {message && <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-sm">{message}</span>}
        </div>
        <form onSubmit={handleCreate} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Job title"
              value={jobForm.title}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            />
            <input
              required
              placeholder="Location"
              value={jobForm.location}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <textarea
            required
            placeholder="Job description"
            value={jobForm.description}
            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
            className="min-h-[140px] rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={jobForm.type}
              onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            >
              <option>Internship</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
            <input
              placeholder="Salary"
              value={jobForm.salary}
              onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <button className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            Post Job
          </button>
        </form>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Applicants</h3>
          <p className="text-sm text-slate-500">Review applications and update status directly from this panel.</p>
        </div>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No applicants yet. New postings will appear here automatically.
            </div>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{application.student?.name || 'Student'}</p>
                    <p className="text-sm text-slate-600">Job: {application.job?.title}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{application.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => handleStatus(application._id, 'accepted')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                    Accept
                  </button>
                  <button onClick={() => handleStatus(application._id, 'rejected')} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default CompanyDashboard;
