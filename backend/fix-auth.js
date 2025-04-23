const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAuth() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete any existing admin users to avoid conflicts
    const User = mongoose.connection.collection('users');
    await User.deleteMany({ email: 'admin@example.com' });
    console.log('Cleared any existing admin users');
    
    // Create fresh admin with correct structure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    await User.insertOne({
      name: 'Administrator',
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isActive: true,
      roles: ['admin'],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixAuth(); 