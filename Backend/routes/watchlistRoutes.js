const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
  getWatchlistStats
} = require('../controllers/watchlistController');

// Validation rules
const addToWatchlistValidation = [
  body('malId')
    .notEmpty()
    .withMessage('MAL ID is required')
    .isInt({ min: 1 })
    .withMessage('Invalid MAL ID'),
  body('isManga')
    .optional()
    .isBoolean()
    .withMessage('isManga must be a boolean'),
  body('status')
    .optional()
    .isIn(['watching', 'completed', 'plan-to-watch', 'dropped'])
    .withMessage('Invalid status'),
  body('episodesWatched')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Episodes watched must be a positive number'),
  body('userRating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10')
];

// All routes are protected
router.use(protect);

router.get('/stats', getWatchlistStats);
router.get('/', getWatchlist);
router.post('/', addToWatchlistValidation, validate, addToWatchlist);
router.put('/:id', updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

module.exports = router;
