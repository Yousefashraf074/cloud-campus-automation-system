const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, type, salary } = req.body;

  const job = await Job.create({
    title,
    description,
    location,
    type,
    salary,
    company: req.user._id,
    companyName: req.user.companyName || req.user.name
  });

  res.status(201).json(job);
});

const getJobs = asyncHandler(async (req, res) => {
  const { search, location, type, status } = req.query;
  const filters = { status: status || 'open' };

  if (search) filters.title = { $regex: search, $options: 'i' };
  if (location) filters.location = { $regex: location, $options: 'i' };
  if (type) filters.type = type;

  const jobs = await Job.find(filters).populate('company', 'name email companyName');
  res.json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'name email companyName');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.json(job);
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user.role !== 'admin' && job.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  const { title, description, location, type, salary, status } = req.body;
  job.title = title || job.title;
  job.description = description || job.description;
  job.location = location || job.location;
  job.type = type || job.type;
  job.salary = salary || job.salary;
  job.status = status || job.status;

  const updatedJob = await job.save();
  res.json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user.role !== 'admin' && job.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await job.remove();
  res.json({ message: 'Job removed' });
});

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
