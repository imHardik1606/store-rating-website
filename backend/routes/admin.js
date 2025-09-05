// backend/routes/admin.js - Updated to use adminUserValidation
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getStores
} = require('../controllers/adminController');
const { adminUserValidation, storeValidation, adminValidation } = require('../utils/validation');
const { auth, adminAuth } = require('../middleware/auth');
const { registerAdmin } = require('../controllers/adminController');

// Admin Register
router.post('/register', adminValidation, registerAdmin); // <-- unprotected route

// All routes require authentication and admin privileges
router.use(auth);
router.use(adminAuth);


// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// User management
router.post('/users', adminUserValidation, createUser); // Admin can create users with any role
router.get('/users', getUsers);

// Store management
router.post('/stores', storeValidation, createStore);
router.get('/stores', getStores);

module.exports = router;