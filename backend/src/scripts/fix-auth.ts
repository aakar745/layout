import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fixAuth() {
  try {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // First, check if there's an admin role or create one
    const RoleCollection = mongoose.connection.collection('roles');
    
    let adminRole = await RoleCollection.findOne({ name: 'Admin' });
    if (!adminRole) {
      console.log('Admin role not found, creating new admin role...');
      adminRole = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Admin',
        description: 'Administrator with full access',
        permissions: ['all'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await RoleCollection.insertOne(adminRole);
      console.log('Admin role created with ID:', adminRole._id);
    } else {
      console.log('Found existing admin role with ID:', adminRole._id);
    }
    
    // Delete any existing admin users to avoid conflicts - use $or to match either username or email
    const UserCollection = mongoose.connection.collection('users');
    const deleteResult = await UserCollection.deleteMany({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@example.com' }
      ]
    });
    console.log(`Cleared ${deleteResult.deletedCount} existing admin user(s)`);
    
    // Create the admin user with correct structure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: adminRole._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await UserCollection.insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('You can now log in with:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    console.log('(You can use either username or email to log in)');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixAuth(); 