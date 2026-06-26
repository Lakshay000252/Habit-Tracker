const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboard, getHabitAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);

router.get('/habit/:habitId', getHabitAnalytics);

module.exports = router;
