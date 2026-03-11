const mongoose = require('mongoose');

class Db {
  async connectMongoDB() {
    try {
      await mongoose.connect('mongodb://cpe_acThPlatform:d251a4befcd5cf45@platform.psru.ac.th:27017/?authSource=admin');
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  async connectDB() {
    try {
      return await this.connectMongoDB();
    } catch (error) {
      throw error;
    }
  }

  async query() {
    throw new Error('MongoDB does not support SQL queries. Use Mongoose methods to interact with the database.');
  }

  async closeConnections() {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connections closed');
    } catch (error) {
      console.error('Error closing connections', { error: error.message });
    }
  }

  getMongoConnection() {
    return mongoose.connection;
  }
}

module.exports = new Db();
