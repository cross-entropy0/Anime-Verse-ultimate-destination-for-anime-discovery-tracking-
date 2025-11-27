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

    // If searching with filters or specific query, check cache first
    if (q || status || type || genre || genres) {
      const query = {};
      
      if (q) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { titleEnglish: { $regex: q, $options: 'i' } },
          { titleJapanese: { $regex: q, $options: 'i' } }
        ];
      }
      
      if (status) query.status = status;
      if (type) query.type = type;
      if (genre || genres) {
        const genreList = (genre || genres).split(',');
        query.genres = { $in: genreList };
      }

      const skip = (page - 1) * limit;
      const results = await Anime.find(query)
        .sort({ score: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Anime.countDocuments(query);
      
      // If we have good cache results, return them
      if (results.length > 0) {
        return res.json({
          success: true,
          data: results,
          pagination: {
            last_visible_page: Math.ceil(total / limit),
            has_next_page: (page * limit) < total,
            current_page: parseInt(page)
          }
        });
      }
    }

    // Build filter object for Jikan API (for fresh data or cache miss)
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

    try {
      // Fetch from Jikan API for fresh data
      const result = await jikanApi.searchAnime(q || '', filters);
      return res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (apiError) {
      // If API fails, return any cached data we have
      console.error('Jikan API error, falling back to cache:', apiError.message);
      const cachedResults = await Anime.find({})
        .sort({ score: -1 })
        .limit(parseInt(limit));
      
      return res.json({
        success: true,
        data: cachedResults,
        pagination: { last_visible_page: 1, has_next_page: false },
        message: 'Showing cached results due to API unavailability'
      });
    }
  } catch (error) {
    console.error('Search error:', error.message);
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
    
    // Try to fetch fresh data from Jikan API (with caching inside)
    try {
      const anime = await jikanApi.fetchAnimeById(id);
      if (!anime) {
        return res.status(404).json({
          success: false,
          message: 'Anime not found'
        });
      }
      return res.json({
        success: true,
        data: anime
      });
    } catch (apiError) {
      // If API fails, try cache as fallback
      console.error('API error for anime details, checking cache:', apiError.message);
      const cached = await Anime.findOne({ malId: parseInt(id) });
      
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          cached: true,
          message: 'Showing cached data due to API unavailability'
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }
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
    console.error(`❌ Error fetching recommendations for anime ${req.params.id}:`, error.message);
    console.error('Error details:', error.response?.data || error);
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
    console.error(`❌ Error fetching reviews for anime ${req.params.id}:`, error.message);
    console.error('Error details:', error.response?.data || error);
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
    
    // Check MongoDB cache first for this season
    const seasonMap = {
      'winter': 'Winter',
      'spring': 'Spring', 
      'summer': 'Summer',
      'fall': 'Fall'
    };
    
    const cached = await Anime.find({
      year: parseInt(year),
      season: seasonMap[season.toLowerCase()]
    }).sort({ score: -1, popularity: 1 }).limit(25);
    
    if (cached.length > 0) {
      return res.json({
        success: true,
        data: cached,
        pagination: {
          has_next_page: false,
          current_page: 1
        }
      });
    }
    
    // Fallback to API if no cache
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
    const { page = 1, limit = 25, refresh } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 25, 100);
    
    // Check if cache is fresh (updated in last 24 hours)
    const cacheAge = await Anime.findOne({ score: { $gt: 0 } })
      .sort({ lastUpdated: -1 })
      .select('lastUpdated');
    
    const isCacheFresh = cacheAge && (Date.now() - cacheAge.lastUpdated < 24 * 60 * 60 * 1000);
    
    // Use cache if fresh and not forcing refresh
    if (isCacheFresh && !refresh) {
      const skip = (page - 1) * parsedLimit;
      const cached = await Anime.find({ score: { $gt: 0 } })
        .sort({ score: -1, scoredBy: -1 })
        .skip(skip)
        .limit(parsedLimit);
      
      const total = await Anime.countDocuments({ score: { $gt: 0 } });
      
      if (cached.length >= parsedLimit * 0.5) {
        return res.json({
          success: true,
          data: cached,
          pagination: {
            last_visible_page: Math.ceil(total / parsedLimit),
            has_next_page: (page * parsedLimit) < total,
            current_page: parseInt(page)
          },
          cached: true
        });
      }
    }
    
    // Fetch fresh data from API if cache is stale or refresh requested
    try {
      const result = await jikanApi.getTopAnime(page, Math.min(parsedLimit, 25));
      return res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        cached: false
      });
    } catch (apiError) {
      // Fallback to cache if API fails
      console.error('API error, using cache:', apiError.message);
      const skip = (page - 1) * parsedLimit;
      const cached = await Anime.find({ score: { $gt: 0 } })
        .sort({ score: -1, scoredBy: -1 })
        .skip(skip)
        .limit(parsedLimit);
      
      return res.json({
        success: true,
        data: cached,
        pagination: { last_visible_page: 1, has_next_page: false },
        cached: true,
        message: 'Showing cached results due to API unavailability'
      });
    }
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
