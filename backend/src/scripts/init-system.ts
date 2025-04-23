import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function initSystem() {
  try {
    console.log('🚀 Starting system initialization...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // 1. Make sure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`✅ Created uploads directory at ${uploadsDir}`);
    }
    
    // 2. Create roles with proper permissions
    const RoleCollection = mongoose.connection.collection('roles');
    
    // Define roles
    const roles = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Admin',
        description: 'Administrator with full access to all features',
        permissions: [
          // User management
          'view_users', 'create_user', 'edit_user', 'delete_user',
          // Role management
          'view_roles', 'create_role', 'edit_role', 'delete_role',
          // Exhibition management
          'view_exhibitions', 'create_exhibition', 'edit_exhibition', 'delete_exhibition',
          // Stall management
          'view_stalls', 'create_stall', 'edit_stall', 'delete_stall',
          // Stall type management
          'view_stall_types', 'create_stall_type', 'edit_stall_type', 'delete_stall_type',
          // Booking management
          'view_bookings', 'create_booking', 'edit_booking', 'delete_booking',
          // Invoice management
          'view_invoices', 'create_invoice', 'edit_invoice', 'delete_invoice',
          // Exhibitor management
          'view_exhibitors', 'create_exhibitor', 'edit_exhibitor', 'delete_exhibitor',
          // Settings
          'view_settings', 'edit_settings',
          // Fixtures
          'view_fixtures', 'create_fixture', 'edit_fixture', 'delete_fixture',
          // Layout
          'manage_layout',
          // Dashboard
          'view_dashboard',
          // Catch-all
          'manage_all'
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Manager',
        description: 'Exhibition manager with limited access',
        permissions: [
          'view_exhibitions', 'create_exhibition', 'edit_exhibition', 
          'view_stalls', 'create_stall', 'edit_stall',
          'view_bookings', 'create_booking', 'edit_booking',
          'view_invoices', 
          'view_exhibitors',
          'view_dashboard'
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Viewer',
        description: 'Read-only access to system',
        permissions: [
          'view_exhibitions', 
          'view_stalls',
          'view_bookings',
          'view_invoices',
          'view_exhibitors',
          'view_dashboard'
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Clear existing roles and create new ones
    await RoleCollection.deleteMany({});
    await RoleCollection.insertMany(roles);
    console.log(`✅ Created ${roles.length} roles with appropriate permissions`);
    
    // 3. Set up stall types
    const StallTypeCollection = mongoose.connection.collection('stalltypes');
    const stallTypes = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Standard',
        description: 'Standard booth space',
        color: '#1890ff',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Premium',
        description: 'Premium booth with better location',
        color: '#722ed1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Platinum',
        description: 'Largest booth with prime location',
        color: '#fa8c16',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await StallTypeCollection.deleteMany({});
    await StallTypeCollection.insertMany(stallTypes);
    console.log(`✅ Created ${stallTypes.length} stall types`);
    
    // 4. Create admin user
    const UserCollection = mongoose.connection.collection('users');
    const adminRole = roles.find(r => r.name === 'Admin');
    
    // Delete existing admin users
    await UserCollection.deleteMany({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@example.com' }
      ]
    });
    
    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    const adminUser = {
      username: 'admin',
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: adminRole?._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await UserCollection.insertOne(adminUser);
    console.log('✅ Created admin user');
    
    // 5. Create settings
    const SettingsCollection = mongoose.connection.collection('settings');
    
    const systemSettings = {
      _id: new mongoose.Types.ObjectId(),
      companyName: 'Exhibition Management System',
      companyLogo: null,
      theme: {
        primaryColor: '#1890ff',
        secondaryColor: '#722ed1',
        backgroundColor: '#f0f2f5'
      },
      exhibitorPortalEnabled: true,
      emailNotificationsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await SettingsCollection.deleteMany({});
    await SettingsCollection.insertOne(systemSettings);
    console.log('✅ Created system settings');
    
    console.log('\n🎉 System initialization complete!');
    console.log('\nYou can log in with:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    
  } catch (error) {
    console.error('❌ Error during system initialization:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
initSystem(); 