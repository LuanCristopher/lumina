const express = require('express');
const router = express.Router();
const { getDevices, createDevice, getReadings } = require('../controllers/deviceController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getDevices)
    .post(protect, createDevice);

router.get('/:id/readings', protect, getReadings);

module.exports = router;
