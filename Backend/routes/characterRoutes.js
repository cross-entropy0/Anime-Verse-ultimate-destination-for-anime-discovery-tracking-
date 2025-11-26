const express = require('express');
const router = express.Router();
const {
  getCharacterById,
  getCharacterPictures
} = require('../controllers/characterController');

router.get('/:id/pictures', getCharacterPictures);
router.get('/:id', getCharacterById);

module.exports = router;
