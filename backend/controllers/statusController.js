const asyncHandler = require('express-async-handler');
const s3 = require('../config/s3');
const { getAwsUploadErrorMessage, validateAwsConfig } = require('../utils/awsHelpers');
const fs = require('fs').promises;
const path = require('path');

const getAwsStatus = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, check if local storage directory exists
    try {
      const resumesDir = path.join(__dirname, '../../static/resumes');
      await fs.access(resumesDir);
      return res.json({ ok: true, message: 'Local file storage is available for resume uploads.' });
    } catch (error) {
      return res.status(500).json({ ok: false, message: 'Local storage directory not accessible.' });
    }
  } else {
    // Production: Check AWS S3
    const missingConfig = validateAwsConfig();
    if (missingConfig) {
      return res.status(500).json({ ok: false, message: missingConfig });
    }

    try {
      await s3.headBucket({ Bucket: process.env.AWS_S3_BUCKET }).promise();
      return res.json({ ok: true, message: 'AWS S3 credentials and bucket are valid.' });
    } catch (error) {
      return res.status(500).json({ ok: false, message: getAwsUploadErrorMessage(error), code: error.code });
    }
  }
});

module.exports = { getAwsStatus };
