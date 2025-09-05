const { validationResult } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const userId = await User.create({ name, email, password, address, role });

    res.status(201).json({
      message: 'User created successfully',
      user: { id: userId, name, email, address, role }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, owner_id } = req.body;

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
      message: 'Store created successfully',
      store: { id: storeId, name, email, address, owner_id }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const filters = req.query;
    const users = await User.getAll(filters);
    
    // Remove password from response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const filters = req.query;
    const stores = await Store.getAll(filters);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getStores
};