const asyncHandler = require('express-async-handler');
const s3 = require('../config/s3');
const User = require('../models/User');
const { getAwsUploadErrorMessage, validateAwsConfig } = require('../utils/awsHelpers');
const fs = require('fs').promises;
const path = require('path');

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Resume file is required');
  }

  const user = await User.findById(req.user._id);

  // Use local storage in development, AWS S3 in production
  if (process.env.NODE_ENV === 'development') {
    try {
      // Create user-specific directory
      const userDir = path.join(__dirname, '../../static/resumes', req.user._id.toString());
      await fs.mkdir(userDir, { recursive: true });

      // Generate unique filename
      const filename = `${Date.now()}_${req.file.originalname}`;
      const filePath = path.join(userDir, filename);

      // Save file locally
      await fs.writeFile(filePath, req.file.buffer);

      // Create local URL
      const resumeUrl = `/static/resumes/${req.user._id}/${filename}`;

      user.resumeUrl = resumeUrl;
      await user.save();

      res.status(201).json({ resumeUrl });
    } catch (error) {
      res.status(500);
      throw new Error(`Resume upload failed. ${error.message}`);
    }
  } else {
    // Production: Use AWS S3
    const missingConfig = validateAwsConfig();
    if (missingConfig) {
      res.status(500);
      throw new Error(`AWS S3 is not configured. ${missingConfig}`);
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `resumes/${req.user._id}/${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    try {
      const result = await s3.upload(params).promise();

      user.resumeUrl = result.Location;
      await user.save();

      res.status(201).json({ resumeUrl: result.Location });
    } catch (error) {
      res.status(500);
      const message = getAwsUploadErrorMessage(error);
      throw new Error(`Resume upload failed. ${message}`);
    }
  }
});

module.exports = { uploadResume };
