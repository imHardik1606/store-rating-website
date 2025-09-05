const { promisePool } = require('../config/database');

class Rating {
  static async create(ratingData) {
    const { user_id, store_id, rating } = ratingData;
    
    const [result] = await promisePool.execute(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP',
      [user_id, store_id, rating]
    );
    
    return result.insertId || result.affectedRows;
  }

  static async getUserRatingForStore(userId, storeId) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    return rows[0];
  }

  static async getStoreRatings(storeId) {
    const [rows] = await promisePool.execute(
      `SELECT r.*, u.name as user_name 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = ? 
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  }
}

module.exports = Rating;