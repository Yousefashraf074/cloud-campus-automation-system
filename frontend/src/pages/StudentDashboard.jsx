import { useEffect, useState } from 'react';
import { fetchJobs, applyJob, getMyApplications, uploadResume } from '../services/api';
import JobCard from '../components/JobCard';

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs().then((response) => setJobs(response.data)).catch(() => {});
    getMyApplications().then((response) => setApplications(response.data)).catch(() => {});
  }, []);

  const handleApply = async (job) => {
    try {
      await applyJob({ jobId: job._id });
      setMessage('Applied successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Apply error');
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await uploadResume(formData);
      setMessage(`Resume uploaded: ${data.resumeUrl}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Student Dashboard</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Access job listings, upload your resume, and manage applications in one polished workspace.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Open Jobs</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Applications</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{applications.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Resume ready</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            Upload Resume
            <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
          </label>
          {message && <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-sm">{message}</span>}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Open Job Listings</h3>
            <p className="text-sm text-slate-500">Browse available roles and apply with one click.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.length > 0 ? jobs.map((job) => <JobCard key={job._id} job={job} onApply={handleApply} />) : <p className="text-slate-600">No open jobs available at the moment.</p>}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900">My Applications</h3>
          <p className="text-sm text-slate-500">Track the status of your recent applications.</p>
        </div>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No applications yet. Apply to a job to see updates here.
            </div>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{application.job?.title || 'Unknown job'}</p>
                    <p className="text-sm text-slate-600">{application.job?.companyName || 'Company name not available'}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{application.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
