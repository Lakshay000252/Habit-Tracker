const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);

router.put(
  '/profile',
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  validate,
  updateProfile
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;
