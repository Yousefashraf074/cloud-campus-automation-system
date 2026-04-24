const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'company', 'admin'],
      default: 'student'
    },
    resumeUrl: { type: String },
    bio: { type: String },
    companyName: { type: String },
    location: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
