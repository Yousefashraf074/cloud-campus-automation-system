const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    coverLetter: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
