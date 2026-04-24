const express = require('express');
const router = express.Router();
const { getAwsStatus } = require('../controllers/statusController');

router.get('/aws', getAwsStatus);

module.exports = router;
