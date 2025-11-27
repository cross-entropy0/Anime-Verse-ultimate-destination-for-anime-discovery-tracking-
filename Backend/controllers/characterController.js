const jikanApi = require('../utils/jikanApi');
const Character = require('../models/Character');

// @desc    Get character by ID
// @route   GET /api/characters/:id
// @access  Public
const getCharacterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Try API first with timeout protection
    try {
      const character = await jikanApi.fetchCharacterById(id);
      if (!character) {
        return res.status(404).json({
          success: false,
          message: 'Character not found'
        });
      }
      return res.json({
        success: true,
        data: character
      });
    } catch (apiError) {
      // Fallback to cache if API fails
      console.error('Character API error, checking cache:', apiError.message);
      const cached = await Character.findOne({ malId: parseInt(id) });
      
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          cached: true
        });
      }
      
      // No cache either - return 404
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }
    next(error);
  }
};

// @desc    Get character pictures
// @route   GET /api/characters/:id/pictures
// @access  Public
const getCharacterPictures = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pictures = await jikanApi.getCharacterPictures(id);

    res.json({
      success: true,
      data: pictures
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharacterById,
  getCharacterPictures
};
