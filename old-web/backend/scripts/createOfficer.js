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

async function createOfficer() {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/floodguard';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Officer credentials
    const officers = [
      {
        username: 'officer1',
        password: 'officer123',
        email: 'officer1@floodguard.local',
        role: 'OFFICER'
      },
      {
        username: 'officer2',
        password: 'officer123',
        email: 'officer2@floodguard.local',
        role: 'OFFICER'
      },
      {
        username: 'เจ้าหน้าที่',
        password: 'officer123',
        email: 'officer@floodguard.local',
        role: 'เจ้าหน้าที่'
      }
    ];

    for (const officer of officers) {
      // Check if officer already exists
      const existingOfficer = await UserModel.findOne({ username: officer.username });
      if (existingOfficer) {
        console.log(`✅ Officer "${officer.username}" already exists. Updating role...`);
        existingOfficer.role = officer.role;
        await existingOfficer.save();
        console.log(`   Role updated to: ${officer.role}`);
      } else {
        // Create new officer user
        const hashedPassword = await hashPassword(officer.password);
        await UserModel.create({
          username: officer.username,
          password: hashedPassword,
          email: officer.email,
          role: officer.role,
          is_active: true
        });
        console.log(`✅ Officer "${officer.username}" created successfully`);
        console.log(`   Password: ${officer.password}`);
        console.log(`   Role: ${officer.role}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n🎉 Done! Officer accounts ready:');
    console.log('1. Username: officer1 / Password: officer123 / Role: OFFICER');
    console.log('2. Username: officer2 / Password: officer123 / Role: OFFICER');
    console.log('3. Username: เจ้าหน้าที่ / Password: officer123 / Role: เจ้าหน้าที่');
    console.log('\nAdmin account:');
    console.log('   Username: admin / Password: admin123 / Role: ADMIN');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createOfficer();
