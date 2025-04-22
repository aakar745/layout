import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/role.model';
import User from '../models/user.model';

dotenv.config();

const setupRolesAndAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Create roles if they don't exist
    const roles = [
      {
        name: 'Admin',
        description: 'Full system access',
        permissions: ['admin', 'read', 'write', 'delete'],
        isActive: true
      },
      {
        name: 'Editor',
        description: 'Can edit content',
        permissions: ['read', 'write'],
        isActive: true
      },
      {
        name: 'Viewer',
        description: 'Read-only access',
        permissions: ['read'],
        isActive: true
      }
    ];

    console.log('Setting up roles...');
    for (const role of roles) {
      const existingRole = await Role.findOne({ name: role.name });
      if (!existingRole) {
        await Role.create(role);
        console.log(`Created ${role.name} role`);
      } else {
        console.log(`${role.name} role already exists`);
      }
    }

    // Get admin role
    console.log('Setting up admin user...');
    const adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    // Delete existing admin user if exists
    console.log('Removing existing admin user if any...');
    await User.deleteOne({ username: 'admin' });

    // Create new admin user
    console.log('Creating fresh admin user...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: adminRole._id,
      isActive: true
    });

    console.log('Created admin user:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminRole.name
    });

    // Verify the admin user was created correctly
    const verifyAdmin = await User.findOne({ username: 'admin' }).populate('role');
    if (verifyAdmin) {
      console.log('Admin user verified:', {
        username: verifyAdmin.username,
        role: (verifyAdmin.role as any).name,
        hashedPassword: verifyAdmin.password.substring(0, 10) + '...'
      });

      // Test password comparison
      console.log('Testing password comparison...');
      const passwordTest = await verifyAdmin.comparePassword('admin123');
      console.log('Password test result:', passwordTest);

      if (!passwordTest) {
        throw new Error('Password verification failed! The user was created but password comparison is not working.');
      }
    }

    console.log('Setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
};

setupRolesAndAdmin(); 