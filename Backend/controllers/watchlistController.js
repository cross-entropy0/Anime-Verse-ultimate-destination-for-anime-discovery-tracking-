const Watchlist = require('../models/Watchlist');
const jikanApi = require('../utils/jikanApi');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const query = { userId: req.user._id };
    if (status) query.status = status;

    const watchlist = await Watchlist.find(query).sort({ updatedAt: -1 });

    // Populate with fresh anime data from cached API
    const populatedWatchlist = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const anime = await jikanApi.fetchAnimeById(item.malId);
          return {
            ...item.toObject(),
            anime
          };
        } catch (error) {
          return {
            ...item.toObject(),
            anime: item.animeData || { title: 'Unknown', malId: item.malId }
          };
        }
      })
    );

    res.json({
      success: true,
      data: populatedWatchlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add anime to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res, next) => {
  try {
    const { malId, status = 'plan-to-watch', episodesWatched = 0, userRating } = req.body;

    // Fetch anime data from Jikan API to validate and cache
    let animeData;
    try {
      animeData = await jikanApi.fetchAnimeById(malId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      userId: req.user._id,
      malId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Anime already in watchlist'
      });
    }

    const watchlistItem = await Watchlist.create({
      userId: req.user._id,
      malId,
      animeData: {
        title: animeData.title,
        imageUrl: animeData.imageUrl,
        episodes: animeData.episodes
      },
      status,
      episodesWatched,
      userRating
    });

    res.status(201).json({
      success: true,
      message: 'Added to watchlist',
      data: {
        ...watchlistItem.toObject(),
        anime: animeData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update watchlist entry
// @route   PUT /api/watchlist/:id
// @access  Private
const updateWatchlistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, episodesWatched, userRating, isFavorite } = req.body;

    const watchlistItem = await Watchlist.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist entry not found'
      });
    }

    if (status !== undefined) watchlistItem.status = status;
    if (episodesWatched !== undefined) watchlistItem.episodesWatched = episodesWatched;
    if (userRating !== undefined) watchlistItem.userRating = userRating;
    if (isFavorite !== undefined) watchlistItem.isFavorite = isFavorite;

    await watchlistItem.save();

    // Fetch anime data
    let anime;
    try {
      anime = await jikanApi.fetchAnimeById(watchlistItem.malId);
    } catch (error) {
      anime = watchlistItem.animeData || { title: 'Unknown', malId: watchlistItem.malId };
    }

    res.json({
      success: true,
      message: 'Watchlist updated',
      data: {
        ...watchlistItem.toObject(),
        anime
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:id
// @access  Private
const removeFromWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const watchlistItem = await Watchlist.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist entry not found'
      });
    }

    await watchlistItem.deleteOne();

    res.json({
      success: true,
      message: 'Removed from watchlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's watchlist stats
// @route   GET /api/watchlist/stats
// @access  Private
const getWatchlistStats = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id });

    const stats = {
      totalAnime: watchlist.length,
      watching: watchlist.filter(item => item.status === 'watching').length,
      completed: watchlist.filter(item => item.status === 'completed').length,
      planToWatch: watchlist.filter(item => item.status === 'plan-to-watch').length,
      dropped: watchlist.filter(item => item.status === 'dropped').length,
      totalEpisodesWatched: watchlist.reduce((sum, item) => sum + item.episodesWatched, 0),
      favoriteCount: watchlist.filter(item => item.isFavorite).length
    };

    // Calculate average rating (only for rated anime)
    const ratedAnime = watchlist.filter(item => item.userRating !== null && item.userRating > 0);
    stats.averageRating = ratedAnime.length > 0
      ? (ratedAnime.reduce((sum, item) => sum + item.userRating, 0) / ratedAnime.length).toFixed(1)
      : 0;

    // Calculate total days watched (assuming 24 min per episode)
    stats.totalDaysWatched = ((stats.totalEpisodesWatched * 24) / 60 / 24).toFixed(1);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
  getWatchlistStats
};
