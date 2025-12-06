const { query } = require('../config/mysql');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, phone, address, role = 'customer' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = `
      INSERT INTO users (email, name, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [email.toLowerCase(), name, hashedPassword, role, phone || '', address || '']);
    
    return {
      id: result.insertId,
      email: email.toLowerCase(),
      name,
      role,
      phone: phone || '',
      address: address || ''
    };
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email.toLowerCase()]);
    return results.length > 0 ? results[0] : null;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateRole(id, role) {
    const sql = 'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?';
    await query(sql, [role, id]);
    return await User.findById(id);
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'phone', 'address'];
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return await User.findById(id);

    fields.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return await User.findById(id);
  }

  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT id, email, name, role, phone, address, created_at FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    sql += ' ORDER BY created_at DESC';

    return await query(sql, params);
  }
}

module.exports = User;
