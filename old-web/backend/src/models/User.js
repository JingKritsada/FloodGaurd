const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, index: true },
  is_active: { type: Boolean, default: true, index: true },
  last_login: { type: Date, default: null },
  role: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const UserModel = mongoose.model('User', UserSchema);

class User {
  static async create(userData) {
    const doc = await UserModel.create(userData);
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      is_active: doc.is_active
    };
  }

  static async findByUsername(username) {
    const doc = await UserModel.findOne({ username, is_active: true }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      role: doc.role,
      email: doc.email,
      password: doc.password,
      is_active: doc.is_active,
      last_login: doc.last_login,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    };
  }

  static async findByEmail(email) {
    const doc = await UserModel.findOne({ email, is_active: true }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      role: doc.role,
      email: doc.email,
      password: doc.password,
      is_active: doc.is_active,
      last_login: doc.last_login,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    };
  }

  static async findById(id) {
    const doc = await UserModel.findOne({ _id: id, is_active: true }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      role: doc.role,
      email: doc.email,
      is_active: doc.is_active,
      last_login: doc.last_login,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    };
  }

  static async updateLastLogin(id) {
    await UserModel.findByIdAndUpdate(id, { last_login: new Date() }).exec();
  }

  static async update(id, updateData) {
    const allowed = {};
    if (updateData.email !== undefined) allowed.email = updateData.email;
    if (updateData.is_active !== undefined) allowed.is_active = updateData.is_active;

    if (Object.keys(allowed).length === 0) {
      return this.findById(id);
    }

    const doc = await UserModel.findByIdAndUpdate(id, allowed, { new: true }).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      is_active: doc.is_active,
      last_login: doc.last_login,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    };
  }

  static async delete(id) {
    await UserModel.findByIdAndDelete(id).exec();
    return { message: 'User deleted successfully' };
  }

  static async createTable() {
    // No-op for MongoDB; ensure indexes
    await UserModel.createIndexes();
  }
}

module.exports = User;
