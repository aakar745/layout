import { Request, Response } from 'express';
import User from '../models/user.model';
import Role from '../models/role.model';

// Use consistent type for user property
// Update the Request interface augmentation to have a single user type definition
declare global {
  namespace Express {
    interface Request {
      user?: { id: string } | any; // Combined type to accommodate both uses
    }
  }
}

/**
 * Create a new user (for admin panel)
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role: roleInput, isActive } = req.body;

    console.log('Create user request:', { 
      username, 
      email, 
      hasPassword: !!password, 
      roleInput, 
      isActive 
    });

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Get role (use provided role or default to Viewer)
    let role;
    try {
      // First try direct match with role name strings like "admin", "manager", etc.
      if (typeof roleInput === 'string') {
        console.log('Looking up role by name:', roleInput);
        role = await Role.findOne({ 
          name: { $regex: new RegExp(`^${roleInput}$`, 'i') } // Case insensitive match
        });

        if (!role) {
          console.log('Role not found by name, looking by ID');
          role = await Role.findById(roleInput);
        }

        if (!role) {
          console.log('Failed to find role, trying to match with capitalized name');
          // Try with capitalized first letter as roles might be stored with capitalized names
          const capitalizedName = roleInput.charAt(0).toUpperCase() + roleInput.slice(1).toLowerCase();
          role = await Role.findOne({ name: capitalizedName });
        }
      } else if (roleInput) {
        // If it's an object or ID, try to find by ID
        const roleId = typeof roleInput === 'object' ? roleInput._id : roleInput;
        console.log('Looking up role by ID:', roleId);
        role = await Role.findById(roleId);
      }
      
      // Fallback to Viewer role
      if (!role) {
        console.log('Using default Viewer role');
        role = await Role.findOne({ name: 'Viewer' });
        if (!role) {
          // If Viewer doesn't exist, try to find any role
          console.log('Viewer role not found, looking for any role');
          role = await Role.findOne({});
          
          if (!role) {
            return res.status(500).json({ 
              message: 'Default role not found and no roles exist in the system',
              availableRoles: []
            });
          }
        }
      }

      console.log('Selected role:', { 
        id: role._id, 
        name: role.name
      });
    } catch (error) {
      console.error('Error finding role:', error);
      return res.status(500).json({ 
        message: 'Error finding role', 
        error,
        roleInput
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role._id,
      isActive: isActive !== undefined ? isActive : true
    });

    console.log('User created successfully:', { 
      id: user._id, 
      username: user.username,
      role: role.name
    });

    // Remove password from response
    const userResponse: Record<string, any> = user.toObject();
    if (userResponse.password) {
      delete userResponse.password;
    }

    res.status(201).json({
      ...userResponse,
      role
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Get all admin users (excluding exhibitor users)
 * This endpoint is for managing admin panel users only
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Find all users except those with the exhibitor role
    const users = await User.find()
      .select('-password')
      .populate('role')
      .then(users => users.filter(user => {
        // Check if role is populated and has a name property
        return user.role && typeof user.role === 'object' && 'name' in user.role && user.role.name !== 'Exhibitor';
      }));
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}; 

/**
 * Delete a user by ID
 * This endpoint is for managing admin panel users only
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deletion of self
    if (req.user && req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    // Prevent deletion of the last admin user
    if (user.role && typeof user.role === 'object' && 'name' in user.role && user.role.name === 'Admin') {
      const adminCount = await User.countDocuments({
        role: user.role._id
      });
      
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error
    });
  }
}; 