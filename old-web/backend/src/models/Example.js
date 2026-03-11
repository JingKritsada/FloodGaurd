const DB = require('../configs/database/Db');

class Example {
  static async create(exampleData, userId = null) {
    const { field_1, field_2, field_3 } = exampleData;
    
    const sql = `
      INSERT INTO examples (field_1, field_2, field_3, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [field_1, field_2, field_3, userId];
    const result = await DB.query(sql, params);
    
    return { id: result.insertId, field_1, field_2, field_3, created_by: userId };
  }

  static async findById(id) {
    const sql = `
      SELECT e.*, u.username as creator_username, u.email as creator_email
      FROM examples e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `;
    
    const results = await DB.query(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let whereClause = 'WHERE 1=1';
      const params = [];
      
      if (filters.field_1) {
        whereClause += ' AND e.field_1 LIKE ?';
        params.push(`%${filters.field_1}%`);
      }
      
      if (filters.field_2) {
        whereClause += ' AND e.field_2 LIKE ?';
        params.push(`%${filters.field_2}%`);
      }
      
      if (filters.createdBy) {
        whereClause += ' AND e.created_by = ?';
        params.push(filters.createdBy);
      }
      
      const countSql = `SELECT COUNT(*) as total FROM examples e ${whereClause}`;
      const countResult = await DB.query(countSql, params);
      const total = countResult[0].total;
      
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 10);
      const offsetNum = (pageNum - 1) * limitNum;
      
      const sql = `
        SELECT e.*, u.username as creator_username, u.email as creator_email
        FROM examples e
        LEFT JOIN users u ON e.created_by = u.id
        ${whereClause}
        ORDER BY e.created_at DESC
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const examples = await DB.query(sql, params);
      
      return {
        examples,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  static async update(id, updateData, userId = null) {
    const updateFields = [];
    const params = [];
    
    if (updateData.field_1 !== undefined) {
      updateFields.push('field_1 = ?');
      params.push(updateData.field_1);
    }
    
    if (updateData.field_2 !== undefined) {
      updateFields.push('field_2 = ?');
      params.push(updateData.field_2);
    }
    
    if (updateData.field_3 !== undefined) {
      updateFields.push('field_3 = ?');
      params.push(updateData.field_3);
    }
    
    if (updateFields.length === 0) {
      return this.findById(id);
    }
    
    if (userId) {
      const checkSql = 'SELECT created_by FROM examples WHERE id = ?';
      const checkResult = await DB.query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        const error = new Error('Example not found');
        error.statusCode = 404;
        throw error;
      }
      
      if (checkResult[0].created_by && checkResult[0].created_by !== userId) {
        const error = new Error('Unauthorized to update this example');
        error.statusCode = 403;
        throw error;
      }
    }
    
    const sql = `
      UPDATE examples 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `;
    
    params.push(id);
    await DB.query(sql, params);
    
    return this.findById(id);
  }

  static async delete(id, userId = null) {
    if (userId) {
      const checkSql = 'SELECT created_by FROM examples WHERE id = ?';
      const checkResult = await DB.query(checkSql, [id]);
      
      if (checkResult.length === 0) {
        const error = new Error('Example not found');
        error.statusCode = 404;
        throw error;
      }
      
      if (checkResult[0].created_by && checkResult[0].created_by !== userId) {
        const error = new Error('Unauthorized to delete this example');
        error.statusCode = 403;
        throw error;
      }
    }
    
    const sql = 'DELETE FROM examples WHERE id = ?';
    await DB.query(sql, [id]);
    
    return { message: 'Example deleted successfully' };
  }

  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS examples (
        id INT AUTO_INCREMENT PRIMARY KEY,
        field_1 VARCHAR(255) NOT NULL,
        field_2 VARCHAR(255),
        field_3 DECIMAL(10,2),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_field_1 (field_1),
        INDEX idx_created_by (created_by),
        INDEX idx_created_at (created_at)
      )
    `;
    
    await DB.query(sql);
  }
}

module.exports = Example;
