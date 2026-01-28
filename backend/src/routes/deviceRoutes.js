const express = require('express');
const router = express.Router();
const { getDevices, createDevice, getReadings, getDeviceStats } = require('../controllers/deviceController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getDevices)
    .post(protect, createDevice);

router.get('/:id/readings', protect, getReadings);
router.get('/:id/stats', protect, getDeviceStats);

module.exports = router;
