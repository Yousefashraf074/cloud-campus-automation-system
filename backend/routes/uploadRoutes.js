const express = require('express');
const multer = require('multer');
const { uploadResume } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);

module.exports = router;
