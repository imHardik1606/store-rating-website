const { promisePool } = require('../config/database');

class Store {
  static async create(storeData) {
    const { name, email, address, owner_id } = storeData;
    
    const [result] = await promisePool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    
    return result.insertId;
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT s.*, 
      COALESCE(AVG(r.rating), 0) as rating,
      COUNT(r.id) as rating_count
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    
    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    query += ' GROUP BY s.id';
    
    const [rows] = await promisePool.execute(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await promisePool.execute(
      `SELECT s.*, 
       COALESCE(AVG(r.rating), 0) as rating,
       COUNT(r.id) as rating_count
       FROM stores s 
       LEFT JOIN ratings r ON s.id = r.store_id 
       WHERE s.id = ? 
       GROUP BY s.id`,
      [id]
    );
    return rows[0];
  }

  static async getByOwnerId(ownerId) {
    const [rows] = await promisePool.execute(
      `SELECT s.*, 
       COALESCE(AVG(r.rating), 0) as rating,
       COUNT(r.id) as rating_count
       FROM stores s 
       LEFT JOIN ratings r ON s.id = r.store_id 
       WHERE s.owner_id = ? 
       GROUP BY s.id`,
      [ownerId]
    );
    return rows[0];
  }

  static async getRatingsForStore(storeId) {
    const [rows] = await promisePool.execute(
      `SELECT r.*, u.name as user_name, u.email as user_email 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = ? 
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  }
}

module.exports = Store;