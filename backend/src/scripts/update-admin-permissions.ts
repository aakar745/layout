import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function updateAdminPermissions() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');

    const RoleCollection = mongoose.connection.collection('roles');
    const UserCollection = mongoose.connection.collection('users');

    // Comprehensive list of permissions based on the frontend
    const allPermissions = [
      // Dashboard permissions
      'dashboard_view', 'dashboard_manage', 'view_dashboard',
      
      // User management
      'users_view', 'users_create', 'users_edit', 'users_delete',
      'view_users', 'create_user', 'edit_user', 'delete_user',
      
      // Role management
      'roles_view', 'roles_create', 'roles_edit', 'roles_delete',
      'view_roles', 'create_role', 'edit_role', 'delete_role',
      
      // Exhibition management
      'exhibitions_view', 'exhibitions_create', 'exhibitions_edit', 'exhibitions_delete',
      'view_exhibitions', 'create_exhibition', 'edit_exhibition', 'delete_exhibition',
      
      // Stall management
      'view_stalls', 'create_stall', 'edit_stall', 'delete_stall',
      
      // Stall type management
      'view_stall_types', 'create_stall_type', 'edit_stall_type', 'delete_stall_type',
      
      // Amenities management
      'amenities_view', 'amenities_create', 'amenities_edit', 'amenities_delete',
      'view_amenities', 'create_amenity', 'edit_amenity', 'delete_amenity',
      
      // Booking management
      'bookings_view', 'bookings_create', 'bookings_edit', 'bookings_delete',
      'view_bookings', 'create_booking', 'edit_booking', 'delete_booking',
      
      // Invoice management
      'invoices_view', 'invoices_create', 'invoices_edit', 'invoices_delete',
      'view_invoices', 'create_invoice', 'edit_invoice', 'delete_invoice',
      
      // Exhibitor management
      'exhibitors_view', 'exhibitors_create', 'exhibitors_edit', 'exhibitors_delete',
      'view_exhibitors', 'create_exhibitor', 'edit_exhibitor', 'delete_exhibitor',
      
      // Settings
      'settings_view', 'settings_edit',
      'view_settings', 'edit_settings',
      
      // Fixtures
      'view_fixtures', 'create_fixture', 'edit_fixture', 'delete_fixture',
      
      // Layout
      'manage_layout',
      
      // Special permissions
      '*', 'all', 'admin', 'superadmin', 'admin_all', 'manage_all', 'full_access'
    ];

    // First, update (or create) the Administrator role with ALL permissions
    console.log('Updating Administrator role with all permissions...');
    const result = await RoleCollection.updateOne(
      { name: 'Administrator' },
      { 
        $set: {
          name: 'Administrator',
          description: 'Administrator with full system access',
          permissions: allPermissions,
          isActive: true,
          updatedAt: new Date() 
        }
      },
      { upsert: true }
    );
    
    console.log(`Administrator role ${result.upsertedCount ? 'created' : 'updated'}`);
    
    // Get the updated role
    const adminRole = await RoleCollection.findOne({ name: 'Administrator' });
    
    if (!adminRole) {
      throw new Error('Failed to find Administrator role');
    }
    
    // Update all users with admin username to use this role
    console.log('Updating admin users to use Administrator role...');
    const userUpdateResult = await UserCollection.updateMany(
      { username: 'admin' },
      { 
        $set: { 
          role: adminRole._id,
          isAdmin: true,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`${userUpdateResult.modifiedCount} admin users updated`);
    
    // Verify the changes
    const updatedAdminUser = await UserCollection.findOne({ username: 'admin' });
    const updatedAdminRole = updatedAdminUser ? await RoleCollection.findOne({ _id: updatedAdminUser.role }) : null;
    
    console.log('Admin now has role:', updatedAdminRole?.name);
    console.log('Role has permissions count:', updatedAdminRole?.permissions?.length);
    
    console.log('✅ Admin permissions successfully updated');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error updating admin permissions:', error);
  }
}

// Run the function
updateAdminPermissions(); 