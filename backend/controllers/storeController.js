const Store = require('../models/Store');
const Rating = require('../models/Rating');

const getStores = async (req, res) => {
  try {
    const filters = req.query;
    const stores = await Store.getAll(filters);
    
    // Add user's rating for each store if user is logged in
    if (req.user && req.user.role === 'user') {
      for (let store of stores) {
        const userRating = await Rating.getUserRatingForStore(req.user.id, store.id);
        store.userRating = userRating ? userRating.rating : null;
      }
    }
    
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStoreDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.getById(id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Add user's rating if user is logged in
    if (req.user && req.user.role === 'user') {
      const userRating = await Rating.getUserRatingForStore(req.user.id, store.id);
      store.userRating = userRating ? userRating.rating : null;
    }
    
    res.json(store);
  } catch (error) {
    console.error('Get store details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStoreOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.getByOwnerId(req.user.id);
    
    if (!store) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }
    
    const ratings = await Store.getRatingsForStore(store.id);
    
    res.json({
      store,
      ratings,
      averageRating: store.rating,
      totalRatings: store.rating_count
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStores,
  getStoreDetails,
  getStoreOwnerDashboard
};