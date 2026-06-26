const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { markCompleted, markIncomplete, getProgressHistory, getDailyProgress } = require('../controllers/progressController');

const router = express.Router();

router.use(protect);

router.post(
  '/complete',
  [
    body('habitId').isMongoId().withMessage('Valid habit ID is required'),
  ],
  validate,
  markCompleted
);

router.post(
  '/incomplete',
  [
    body('habitId').isMongoId().withMessage('Valid habit ID is required'),
  ],
  validate,
  markIncomplete
);

router.get('/history', getProgressHistory);

router.get('/daily', getDailyProgress);

module.exports = router;
