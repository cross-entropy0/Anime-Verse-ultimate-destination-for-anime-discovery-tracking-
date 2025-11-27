const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  malId: {
    type: Number,
    required: true,
    index: true
  },
  animeData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'plan-to-watch', 'dropped'],
    default: 'plan-to-watch',
    index: true
  },
  episodesWatched: {
    type: Number,
    default: 0,
    min: 0
  },
  userRating: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isManga: {
    type: Boolean,
    default: false
  },
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Compound unique index: user can only have one entry per anime
watchlistSchema.index({ userId: 1, malId: 1 }, { unique: true });

// Update dates based on status changes
watchlistSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'watching' && !this.startedAt) {
      this.startedAt = new Date();
    }
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
