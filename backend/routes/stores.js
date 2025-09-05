const express = require('express');
const router = express.Router();
const {
  getStores,
  getStoreDetails,
  getStoreOwnerDashboard
} = require('../controllers/storeController');
const { auth, storeOwnerAuth } = require('../middleware/auth');

router.get('/', auth, getStores);
router.get('/owner/dashboard', auth, storeOwnerAuth, getStoreOwnerDashboard);
router.get('/:id', auth, getStoreDetails);

module.exports = router;