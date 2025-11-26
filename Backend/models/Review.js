const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  animeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 10
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    minlength: [50, 'Review must be at least 50 characters'],
    maxlength: [5000, 'Review cannot exceed 5000 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound unique index: one review per user per anime
reviewSchema.index({ userId: 1, animeId: 1 }, { unique: true });

// Virtual for likes count
reviewSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Include virtuals when converting to JSON
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);
