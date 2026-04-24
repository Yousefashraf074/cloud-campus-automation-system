const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getAllApplications,
  getCompanyApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').post(protect, authorize('student'), applyJob).get(protect, authorize('admin'), getAllApplications);
router.route('/me').get(protect, authorize('student'), getMyApplications);
router.route('/company').get(protect, authorize('company', 'admin'), getCompanyApplications);
router.route('/:id').put(protect, updateApplicationStatus);

module.exports = router;
