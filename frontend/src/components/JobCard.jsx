const JobCard = ({ job, onApply, onView }) => {
  return (
    <div className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.companyName}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{job.type}</span>
      </div>
      <p className="mt-4 text-slate-600 line-clamp-3">{job.description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-x-2 text-sm text-slate-500">
          <span>{job.location}</span>
          {job.salary && <span>• {job.salary}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {onView && (
            <button onClick={() => onView(job)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              View
            </button>
          )}
          {onApply && (
            <button onClick={() => onApply(job)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700">
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
