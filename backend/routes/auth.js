// backend/routes/auth.js - Complete authentication routes
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  updatePassword, 
  getCurrentUser 
} = require('../controllers/authController');
const { 
  userValidation, 
  loginValidation, 
  passwordUpdateValidation 
} = require('../utils/validation');
const { auth } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/register', userValidation, register); // User self-registration
router.post('/login', loginValidation, login); // User login

// Protected routes (authentication required)
router.get('/me', auth, getCurrentUser); // Get current user info
router.put('/password', auth, passwordUpdateValidation, updatePassword); // Update password

module.exports = router;