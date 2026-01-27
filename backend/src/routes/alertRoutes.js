const express = require('express');
const router = express.Router();
const { getAlerts, resolveAlert } = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAlerts);
router.patch('/:id/resolve', protect, resolveAlert);

module.exports = router;
