const Anime = require('../models/Anime');
const jikanApi = require('../utils/jikanApi');

// @desc    Get all anime with filters and pagination
// @route   GET /api/anime
// @access  Public
const getAllAnime = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      year,
      season,
      status,
      sort = 'score_desc',
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (genre) {
      const genres = genre.split(',');
      query.genres = { $in: genres };
    }
    
    if (year) query.year = parseInt(year);
    if (season) query.season = season.toLowerCase();
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleEnglish: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort
    let sortOption = {};
    switch (sort) {
      case 'score_desc':
        sortOption = { score: -1 };
        break;
      case 'score_asc':
        sortOption = { score: 1 };
        break;
      case 'title_asc':
        sortOption = { title: 1 };
        break;
      case 'year_desc':
        sortOption = { year: -1 };
        break;
      default:
        sortOption = { score: -1 };
    }

    const skip = (page - 1) * limit;
    const total = await Anime.countDocuments(query);
    const anime = await Anime.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: anime,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search anime
// @route   GET /api/anime/search
// @access  Public
const searchAnime = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 25, type, status, rating, genre, genres, order_by, sort } = req.query;

    // Build filter object for Jikan API
    const filters = {
      page,
      limit,
      type,
      status,
      rating,
      genre: genre || genres,
      order_by,
      sort
    };

    // Try fetching from Jikan API
    const result = await jikanApi.searchAnime(q || '', filters);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Search error:', error.message);
    // Return empty results instead of failing
    res.json({
      success: true,
      data: [],
      pagination: { last_visible_page: 1, has_next_page: false },
      message: 'Search temporarily unavailable. Please try again in a moment.'
    });
  }
};

// @desc    Get anime by ID
// @route   GET /api/anime/:id
// @access  Public
const getAnimeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch from Jikan API (includes caching)
    const anime = await jikanApi.fetchAnimeById(id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    res.json({
      success: true,
      data: anime
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
    next(error);
  }
};

// @desc    Get anime pictures
// @route   GET /api/anime/:id/pictures
// @access  Public
const getAnimePictures = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pictures = await jikanApi.getAnimePictures(id);

    res.json({
      success: true,
      data: pictures
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get anime characters
// @route   GET /api/anime/:id/characters
// @access  Public
const getAnimeCharacters = async (req, res, next) => {
  try {
    const { id } = req.params;
    const characters = await jikanApi.getAnimeCharacters(id);

    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get anime staff
// @route   GET /api/anime/:id/staff
// @access  Public
const getAnimeStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await jikanApi.getAnimeStaff(id);

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get anime episodes
// @route   GET /api/anime/:id/episodes
// @access  Public
const getAnimeEpisodes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    
    const result = await jikanApi.getAnimeEpisodes(id, page);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get anime recommendations
// @route   GET /api/anime/:id/recommendations
// @access  Public
const getAnimeRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recommendations = await jikanApi.getAnimeRecommendations(id);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    // Return empty array on error instead of failing
    res.json({
      success: true,
      data: [],
      message: 'Recommendations temporarily unavailable'
    });
  }
};

// @desc    Get anime reviews from MAL
// @route   GET /api/anime/:id/reviews
// @access  Public
const getAnimeReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    
    const result = await jikanApi.getAnimeReviews(id, page);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    // Return empty array on error instead of failing
    res.json({
      success: true,
      data: [],
      pagination: { last_visible_page: 1, has_next_page: false },
      message: 'Reviews temporarily unavailable'
    });
  }
};

// @desc    Get seasonal anime
// @route   GET /api/anime/seasonal/:year/:season
// @access  Public
const getSeasonalAnime = async (req, res, next) => {
  try {
    const { year, season } = req.params;
    
    const result = await jikanApi.getSeasonalAnime(year, season);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching seasonal anime:', error.message);
    res.json({
      success: true,
      data: [],
      pagination: { last_visible_page: 1, has_next_page: false },
      message: 'Seasonal anime temporarily unavailable. Please try again in a moment.'
    });
  }
};

// @desc    Get top anime
// @route   GET /api/anime/top
// @access  Public
const getTopAnime = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 25, 25); // Max 25 per Jikan API
    
    const result = await jikanApi.getTopAnime(page, parsedLimit);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching top anime:', error.message);
    res.json({
      success: true,
      data: [],
      pagination: { last_visible_page: 1, has_next_page: false },
      message: 'Top anime temporarily unavailable. Please try again in a moment.'
    });
  }
};

// @desc    Get random anime
// @route   GET /api/anime/random
// @access  Public
const getRandomAnime = async (req, res, next) => {
  try {
    const anime = await jikanApi.getRandomAnime();

    res.json({
      success: true,
      data: anime
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnime,
  searchAnime,
  getAnimeById,
  getAnimePictures,
  getAnimeCharacters,
  getAnimeStaff,
  getAnimeEpisodes,
  getAnimeRecommendations,
  getAnimeReviews,
  getSeasonalAnime,
  getTopAnime,
  getRandomAnime
};
