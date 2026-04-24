const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/').get(protect, authorize('admin'), getAllUsers);

module.exports = router;
