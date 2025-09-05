const { validationResult } = require('express-validator');
const Rating = require('../models/Rating');

const submitRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    const ratingId = await Rating.create({ user_id, store_id, rating });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: { id: ratingId, user_id, store_id, rating }
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.getUserRatingForStore(userId, storeId);
    
    res.json(rating || null);
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitRating,
  getUserRating
};