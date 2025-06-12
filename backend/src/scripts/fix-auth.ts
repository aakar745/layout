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
    
    // First, check if there's an admin role or create one with specific permissions
    const RoleCollection = mongoose.connection.collection('roles');
    
    // Define comprehensive permissions for admin
    const adminPermissions = [
      'view_users', 'create_user', 'edit_user', 'delete_user',
      'view_roles', 'create_role', 'edit_role', 'delete_role',
      'view_exhibitions', 'create_exhibition', 'edit_exhibition', 'delete_exhibition',
      'view_stalls', 'create_stall', 'edit_stall', 'delete_stall',
      'view_amenities', 'create_amenity', 'edit_amenity', 'delete_amenity',
      'view_bookings', 'create_booking', 'edit_booking', 'delete_booking',
      'view_invoices', 'create_invoice', 'edit_invoice', 'delete_invoice',
      'view_exhibitors', 'edit_exhibitor', 'delete_exhibitor',
      'view_settings', 'edit_settings',
      'manage_all', 'all' // Fallback permissions
    ];
    
    // Delete any existing Admin role
    await RoleCollection.deleteMany({ name: 'Admin' });
    console.log('Cleared existing admin roles');
    
    // Create fresh Admin role
    const adminRole = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Admin',
      description: 'Administrator with full access to all features',
      permissions: adminPermissions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await RoleCollection.insertOne(adminRole);
    console.log('Admin role created with ID:', adminRole._id);
    
    // Delete any existing admin users to avoid conflicts
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