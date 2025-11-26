const Review = require('../models/Review');
const Anime = require('../models/Anime');

// @desc    Get reviews for an anime
// @route   GET /api/reviews/anime/:animeId
// @access  Public
const getAnimeReviews = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const { sort = 'recent' } = req.query;

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'liked':
        // Sort by number of likes (calculated field)
        break;
      case 'rating_high':
        sortOption = { rating: -1 };
        break;
      case 'rating_low':
        sortOption = { rating: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    let reviews = await Review.find({ animeId })
      .populate('userId', 'username avatar')
      .sort(sortOption);

    // If sorting by likes, do it manually
    if (sort === 'liked') {
      reviews = reviews.sort((a, b) => b.likes.length - a.likes.length);
    }

    // Add isLikedByCurrentUser field if user is logged in
    if (req.user) {
      reviews = reviews.map(review => {
        const reviewObj = review.toObject();
        reviewObj.isLikedByCurrentUser = review.likes.some(
          userId => userId.toString() === req.user._id.toString()
        );
        return reviewObj;
      });
    }

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { animeId, rating, reviewText } = req.body;

    // Check if anime exists
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Check if user already reviewed this anime
    const existing = await Review.findOne({
      userId: req.user._id,
      animeId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this anime'
      });
    }

    const review = await Review.create({
      userId: req.user._id,
      animeId,
      rating,
      reviewText
    });

    const populated = await Review.findById(review._id).populate('userId', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;

    const review = await Review.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not the author'
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;

    await review.save();

    const populated = await Review.findById(review._id).populate('userId', 'username avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not the author'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/unlike a review
// @route   POST /api/reviews/:id/like
// @access  Private
const likeReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const likeIndex = review.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      review.likes.splice(likeIndex, 1);
    } else {
      // Like
      review.likes.push(req.user._id);
    }

    await review.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Review unliked' : 'Review liked',
      likesCount: review.likes.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnimeReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview
};
