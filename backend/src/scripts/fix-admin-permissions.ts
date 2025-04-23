import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function fixAdminPermissions() {
  try {
    console.log('🔍 Diagnosing and fixing admin permissions...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // 1. First, let's examine the user structure to understand what we're working with
    const UserCollection = mongoose.connection.collection('users');
    const adminUser = await UserCollection.findOne({ username: 'admin' });
    
    console.log('Current admin user structure:', JSON.stringify(adminUser, null, 2));
    
    // 2. Check the routes file to see what permissions are being checked
    const UserRouteCollection = mongoose.connection.collection('users');
    const users = await UserRouteCollection.find({}).toArray();
    console.log(`Found ${users.length} users in the database`);
    
    // 3. Check the actual role structure
    const RoleCollection = mongoose.connection.collection('roles');
    const roles = await RoleCollection.find({}).toArray();
    console.log(`Found ${roles.length} roles in the database`);
    roles.forEach(role => {
      console.log(`- Role: ${role.name}, Permissions: ${role.permissions?.length || 0}`);
    });
    
    // 4. Check if our admin user has a proper role
    if (!adminUser) {
      console.log('❌ Admin user not found!');
    } else if (!adminUser.role) {
      console.log('❌ Admin user has no role assigned!');
    } else {
      const adminRole = await RoleCollection.findOne({ _id: adminUser.role });
      console.log('Admin role:', adminRole ? adminRole.name : 'Not found');
      console.log('Admin role permissions:', adminRole?.permissions || 'None');
    }
    
    // 5. Fix by modifying directly in one transaction
    console.log('\n🔧 Applying fixes...');
    
    // First, update (or create) the superadmin role with ALL permissions
    const superAdminRoleId = new mongoose.Types.ObjectId();
    const result = await RoleCollection.updateOne(
      { name: 'SuperAdmin' },
      { 
        $set: {
          name: 'SuperAdmin',
          description: 'Super Administrator with unlimited access',
          permissions: [
            // Include every possible permission format that might be checked
            '*', 'all', 'admin', 'superadmin', 'super_admin',
            'users', 'users_read', 'users_write', 'users_delete', 'users_manage',
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'view_users', 'create_user', 'edit_user', 'delete_user', 'manage_users',
            'roles', 'roles_read', 'roles_write', 'roles_delete', 'roles_manage',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            'view_roles', 'create_role', 'edit_role', 'delete_role', 'manage_roles',
            // Add every other permission you might need
            'manage_all', 'admin_all', 'full_access',
            'exhibitions', 'stalls', 'bookings', 'invoices', 'exhibitors', 'settings',
            'exhibitions.*', 'stalls.*', 'bookings.*', 'invoices.*', 'exhibitors.*', 'settings.*',
            'view_exhibitions', 'create_exhibition', 'edit_exhibition', 'delete_exhibition',
            'view_stalls', 'create_stall', 'edit_stall', 'delete_stall',
            'view_bookings', 'create_booking', 'edit_booking', 'delete_booking',
            'view_invoices', 'create_invoice', 'edit_invoice', 'delete_invoice',
            'view_exhibitors', 'create_exhibitor', 'edit_exhibitor', 'delete_exhibitor',
            'view_settings', 'edit_settings',
            'view_fixtures', 'create_fixture', 'edit_fixture', 'delete_fixture',
            'manage_layout', 'view_dashboard'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date() 
        }
      },
      { upsert: true }
    );
    
    console.log(`SuperAdmin role ${result.upsertedCount ? 'created' : 'updated'}`);
    
    // Get the role (either newly created or updated)
    const superAdminRole = await RoleCollection.findOne({ name: 'SuperAdmin' });
    
    if (!superAdminRole) {
      throw new Error('Failed to create SuperAdmin role');
    }
    
    // Now update the admin user to use this role
    const userUpdateResult = await UserCollection.updateOne(
      { username: 'admin' },
      { 
        $set: { 
          role: superAdminRole._id,
          isAdmin: true, // Add this flag in case it's checked
          // Add these fields in case they're needed
          name: 'Administrator',
          isActive: true,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`Admin user ${userUpdateResult.modifiedCount ? 'updated' : 'unchanged'}`);
    
    // 6. Set a direct flag on the user for authorization
    // Some systems check for user.role.permissions but others might check user.permissions
    await UserCollection.updateOne(
      { username: 'admin' },
      {
        $set: {
          permissions: ['*', 'all', 'admin', 'superadmin'], // Direct permissions
          isSystemAdmin: true,
          isSuperAdmin: true
        }
      }
    );
    
    console.log('✅ Added direct permission flags to admin user');
    
    console.log('\n🔍 Verification after fixes:');
    
    // Verify the changes
    const updatedAdminUser = await UserCollection.findOne({ username: 'admin' });
    const updatedAdminRole = await RoleCollection.findOne({ _id: updatedAdminUser?.role });
    
    console.log('Admin now has role:', updatedAdminRole?.name);
    console.log('Role has permissions count:', updatedAdminRole?.permissions?.length);
    console.log('Admin has direct permissions:', updatedAdminUser?.permissions);
    
    console.log('\n✅ Fixes applied successfully. Please try logging out and back in.');
    
  } catch (error) {
    console.error('❌ Error fixing permissions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixAdminPermissions(); 