const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { getMotivation, getSuggestions } = require('../controllers/aiController');

const router = express.Router();

router.use(protect);

router.post(
  '/motivate',
  [
    body('mood').optional().isIn(['happy', 'sad', 'lazy', 'stressed', 'motivated'])
      .withMessage('Invalid mood. Choose: happy, sad, lazy, stressed, or motivated'),
  ],
  validate,
  getMotivation
);

router.post('/suggestions', getSuggestions);

module.exports = router;
