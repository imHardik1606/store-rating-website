// backend/controllers/adminController.js - Updated to use adminUserValidation
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');
const { promisePool } = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard statistics' 
    });
  }
};

// Creates new admin

const registerAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, address } = req.body;

    // Check if admin already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Admin already exists with this email address' 
      });
    }

    // Create admin (force role to 'admin')
    const userId = await User.create({ name, email, password, address, role: 'admin' });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      user: { id: userId, name, email, address, role: 'admin' }
    });
  } catch (error) {
    console.error('Register admin error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to register admin' 
    });
  }
};

// Admin creates user (can set any role)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, address, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email address' 
      });
    }

    // Create user with specified role
    const userId = await User.create({ name, email, password, address, role });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { id: userId, name, email, address, role }
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email address is already registered' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create user' 
    });
  }
};

const createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, address, owner_id } = req.body;

    // If owner_id is provided, verify the user exists and is not already a store owner
    if (owner_id) {
      const user = await User.findById(owner_id);
      if (!user) {
        return res.status(400).json({ 
          success: false,
          error: 'Selected owner does not exist' 
        });
      }

      // Check if user already owns a store
      const [existingStore] = await promisePool.execute(
        'SELECT id FROM stores WHERE owner_id = ?',
        [owner_id]
      );
      
      if (existingStore.length > 0) {
        return res.status(400).json({ 
          success: false,
          error: 'User already owns a store' 
        });
      }
    }

    // Create store
    const storeId = await Store.create({ name, email, address, owner_id });

    // If owner_id is provided, update user role to store_owner
    if (owner_id) {
      await promisePool.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        ['store_owner', owner_id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      store: { id: storeId, name, email, address, owner_id }
    });
  } catch (error) {
    console.error('Create store error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Store email is already registered' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create store' 
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const filters = req.query;
    const users = await User.getAll(filters);
    
    // Remove password from all users
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    res.json({
      success: true,
      data: safeUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users' 
    });
  }
};

const getStores = async (req, res) => {
  try {
    const filters = req.query;
    const stores = await Store.getAll(filters);
    
    res.json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch stores' 
    });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  registerAdmin,
  createStore,
  getUsers,
  getStores
};