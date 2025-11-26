const jikanApi = require('../utils/jikanApi');

// @desc    Get character by ID
// @route   GET /api/characters/:id
// @access  Public
const getCharacterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const character = await jikanApi.fetchCharacterById(id);

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    res.json({
      success: true,
      data: character
    });
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
