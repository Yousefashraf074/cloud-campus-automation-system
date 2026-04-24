const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');

const applyJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  const alreadyApplied = await Application.findOne({ student: req.user._id, job: jobId });
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied to this job');
  }

  const application = await Application.create({
    student: req.user._id,
    job: jobId,
    company: job.company,
    coverLetter
  });

  res.status(201).json(application);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate('job')
    .populate('company', 'name email companyName');
  res.json(applications);
});

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate('student', 'name email resumeUrl')
    .populate('job')
    .populate('company', 'name email companyName');
  res.json(applications);
});

const getCompanyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ company: req.user._id })
    .populate('student', 'name email resumeUrl')
    .populate('job');
  res.json(applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (application.company.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to modify this application');
  }
  const { status } = req.body;
  application.status = status || application.status;
  const updated = await application.save();
  res.json(updated);
});

module.exports = { applyJob, getMyApplications, getAllApplications, getCompanyApplications, updateApplicationStatus };
