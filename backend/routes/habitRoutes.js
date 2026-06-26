const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  createHabit, getHabits, getHabit, updateHabit, deleteHabit,
} = require('../controllers/habitController');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('habitName').trim().notEmpty().withMessage('Habit name is required')
      .isLength({ min: 2 }).withMessage('Habit name must be at least 2 characters'),
    body('category').isIn(['study', 'exercise', 'reading', 'meditation', 'water', 'custom'])
      .withMessage('Invalid category'),
    body('targetFrequency').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid frequency'),
  ],
  validate,
  createHabit
);

router.get('/', getHabits);

router.get('/:id', getHabit);

router.put('/:id', updateHabit);

router.delete('/:id', deleteHabit);

module.exports = router;
