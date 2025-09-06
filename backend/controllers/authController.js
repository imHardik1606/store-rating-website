// backend/controllers/authController.js - Enhanced with better error handling
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// User self-registration (public route)
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email address' 
      });
    }

    // Role validation → only allow "user" or "owner"
    const validRoles = ["user", "owner"];
    const assignedRole = validRoles.includes(role) ? role : "user";

    // Create user with chosen role
    const userId = await User.create({ 
      name, 
      email, 
      password, 
      address, 
      role: assignedRole 
    });
    
    // Generate token
    const token = generateToken(userId);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { 
        id: userId, 
        name, 
        email, 
        address, 
        role: assignedRole 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error from database
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email address is already registered' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create account. Please try again.' 
    });
  }
};


// User login (public route)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Validate password
    const isPasswordValid = await User.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return success response (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed. Please try again.' 
    });
  }
};

// Update password (protected route)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Basic validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Current password and new password are required' 
      });
    }

    // Validate new password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        success: false,
        error: 'New password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character' 
      });
    }

    // Get current user with password
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Validate current password
    const isCurrentPasswordValid = await User.validatePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false,
        error: 'Current password is incorrect' 
      });
    }

    // Check if new password is same as current
    const isSamePassword = await User.validatePassword(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false,
        error: 'New password must be different from current password' 
      });
    }

    // Update password
    const updated = await User.updatePassword(req.user.id, newPassword);
    
    if (updated) {
      res.json({ 
        success: true,
        message: 'Password updated successfully' 
      });
    } else {
      res.status(400).json({ 
        success: false,
        error: 'Failed to update password' 
      });
    }
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update password. Please try again.' 
    });
  }
};

// Get current user info (protected route)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get user information' 
    });
  }
};

module.exports = { register, login, updatePassword, getCurrentUser };