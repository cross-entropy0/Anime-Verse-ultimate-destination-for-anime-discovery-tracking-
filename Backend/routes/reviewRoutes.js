const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getAnimeReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview
} = require('../controllers/reviewController');

// Validation rules
const reviewValidation = [
  body('animeId')
    .notEmpty()
    .withMessage('Anime ID is required')
    .isMongoId()
    .withMessage('Invalid anime ID'),
  body('rating')
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating must be between 1 and 10'),
  body('reviewText')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Review must be 50-5000 characters')
];

// Public route with optional auth (to show if user liked)
router.get('/anime/:animeId', optionalAuth, getAnimeReviews);

// Protected routes
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/like', protect, likeReview);

module.exports = router;
