const { promisePool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, address, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await promisePool.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT u.*, 
      CASE 
        WHEN u.role = 'store_owner' THEN (
          SELECT AVG(r.rating) 
          FROM ratings r 
          JOIN stores s ON r.store_id = s.id 
          WHERE s.owner_id = u.id
        )
        ELSE NULL 
      END as rating
      FROM users u 
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    
    if (filters.email) {
      query += ' AND u.email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    
    if (filters.address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    
    if (filters.role) {
      query += ' AND u.role = ?';
      params.push(filters.role);
    }

    const [rows] = await promisePool.execute(query, params);
    return rows;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const [result] = await promisePool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    return result.affectedRows > 0;
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getStats() {
    const [userCount] = await promisePool.execute('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await promisePool.execute('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await promisePool.execute('SELECT COUNT(*) as count FROM ratings');
    
    return {
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count
    };
  }
}

module.exports = User;