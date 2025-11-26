const jikanApi = require('../utils/jikanApi');

// @desc    Search manga
// @route   GET /api/manga/search
// @access  Public
const searchManga = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 25, type, status, order_by, sort, genre, genres } = req.query;

    const filters = {
      page,
      limit,
      type,
      status,
      order_by,
      sort,
      genre: genre || genres
    };

    const result = await jikanApi.searchManga(q || '', filters);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get manga by ID
// @route   GET /api/manga/:id
// @access  Public
const getMangaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const manga = await jikanApi.fetchMangaById(id);

    if (!manga) {
      return res.status(404).json({
        success: false,
        message: 'Manga not found'
      });
    }

    res.json({
      success: true,
      data: manga
    });
  } catch (error) {
    console.error('Manga fetch error:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Manga not found'
      });
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid manga data',
        error: error.message
      });
    }
    next(error);
  }
};

// @desc    Get manga pictures
// @route   GET /api/manga/:id/pictures
// @access  Public
const getMangaPictures = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pictures = await jikanApi.getMangaPictures(id);

    res.json({
      success: true,
      data: pictures
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get manga characters
// @route   GET /api/manga/:id/characters
// @access  Public
const getMangaCharacters = async (req, res, next) => {
  try {
    const { id } = req.params;
    const characters = await jikanApi.getMangaCharacters(id);

    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get manga recommendations
// @route   GET /api/manga/:id/recommendations
// @access  Public
const getMangaRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recommendations = await jikanApi.getMangaRecommendations(id);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top manga
// @route   GET /api/manga/top
// @access  Public
const getTopManga = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    
    const result = await jikanApi.getTopManga(page, limit);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get random manga
// @route   GET /api/manga/random
// @access  Public
const getRandomManga = async (req, res, next) => {
  try {
    const manga = await jikanApi.getRandomManga();

    res.json({
      success: true,
      data: manga
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchManga,
  getMangaById,
  getMangaPictures,
  getMangaCharacters,
  getMangaRecommendations,
  getTopManga,
  getRandomManga
};
