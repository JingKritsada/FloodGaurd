require('dotenv').config();
const mongoose = require('mongoose');
const { hashPassword } = require('../src/utils/encryption');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date, default: null },
  role: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const UserModel = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/floodguard';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // เปลี่ยนเป็น password ที่ต้องการ
    const adminEmail = 'admin@floodguard.local';

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('Admin user already exists. Updating role...');
      existingAdmin.role = 'ADMIN';
      await existingAdmin.save();
      console.log('✅ Admin role updated successfully');
    } else {
      // Create new admin user
      const hashedPassword = await hashPassword(adminPassword);
      const admin = await UserModel.create({
        username: adminUsername,
        password: hashedPassword,
        email: adminEmail,
        role: 'ADMIN',
        is_active: true
      });
      console.log('✅ Admin user created successfully');
      console.log('Username:', adminUsername);
      console.log('Password:', adminPassword);
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
