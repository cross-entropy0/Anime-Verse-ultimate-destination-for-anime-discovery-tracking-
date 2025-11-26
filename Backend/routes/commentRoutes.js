const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getAnimeComments,
  getMangaComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');

// Validation rules
const commentValidation = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be 1-1000 characters')
];

// Public routes with optional auth (to show if user liked)
router.get('/anime/:animeId', optionalAuth, getAnimeComments);
router.get('/manga/:mangaId', optionalAuth, getMangaComments);

// Protected routes
router.post('/', protect, commentValidation, validate, createComment);
router.put('/:id', protect, commentValidation, validate, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);

module.exports = router;
