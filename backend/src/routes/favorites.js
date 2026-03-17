const express = require('express');
const { toggleFavorite, getFavorites } = require('../controllers/favorites');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All favorite routes need login

router.route('/').get(getFavorites);
router.route('/:propertyId').post(toggleFavorite);

module.exports = router;
