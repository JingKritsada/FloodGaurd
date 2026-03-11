require('dotenv').config();
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date, default: null },
  role: { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const UserModel = mongoose.model('User', UserSchema);

async function updateUserRole() {
  try {
    const username = process.argv[2];
    const role = process.argv[3] || 'ADMIN';

    if (!username) {
      console.error('Usage: node updateUserRole.js <username> [role]');
      console.error('Example: node updateUserRole.js myuser ADMIN');
      process.exit(1);
    }

    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/floodguard';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Find and update user
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.error(`❌ User "${username}" not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.username}`);
    console.log(`Current role: ${user.role || 'null'}`);
    
    user.role = role;
    await user.save();
    
    console.log(`✅ User role updated to: ${role}`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUserRole();
