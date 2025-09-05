const express = require('express');
const router = express.Router();
const { submitRating, getUserRating } = require('../controllers/ratingController');
const { ratingValidation } = require('../utils/validation');
const { auth } = require('../middleware/auth');

router.use(auth);

router.post('/', ratingValidation, submitRating);
router.get('/user/:storeId', getUserRating);

module.exports = router;