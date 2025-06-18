import { Request, Response } from 'express';
import User from '../models/user.model';
import Role from '../models/role.model';
import { logActivity } from '../services/activity.service';

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
    const { username, name, email, password, role: roleInput, isActive, assignedExhibitions } = req.body;

    console.log('Create user request:', { 
      username, 
      email, 
      hasPassword: !!password, 
      roleInput, 
      isActive,
      assignedExhibitions: assignedExhibitions?.length || 0
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
      name,
      email,
      password,
      role: role._id,
      isActive: isActive !== undefined ? isActive : true,
      assignedExhibitions: assignedExhibitions || []
    });

    console.log('User created successfully:', { 
      id: user._id, 
      username: user.username,
      role: role.name
    });

    // Assign user to exhibitions if provided
    if (assignedExhibitions && Array.isArray(assignedExhibitions) && assignedExhibitions.length > 0) {
      try {
        // Import Exhibition model
        const Exhibition = require('../models/exhibition.model').default;
        
        // Add user to the assignedUsers array of selected exhibitions
        await Exhibition.updateMany(
          { _id: { $in: assignedExhibitions } },
          { $addToSet: { assignedUsers: user._id } }
        );
        
        console.log(`User ${user.username} assigned to ${assignedExhibitions.length} exhibitions`);
      } catch (assignmentError) {
        console.error('Error assigning user to exhibitions:', assignmentError);
        // Don't fail user creation if exhibition assignment fails
      }
    }

    // Remove password from response
    const userResponse: Record<string, any> = user.toObject();
    if (userResponse.password) {
      delete userResponse.password;
    }

    // Log successful user creation
    await logActivity(req, {
      action: 'user_created',
      resource: 'user',
      resourceId: user._id.toString(),
      description: `Created user "${username}" with role "${role.name}"`,
      newValues: {
        username,
        name,
        email,
        role: role.name,
        isActive: user.isActive,
        assignedExhibitions: assignedExhibitions?.length || 0
      },
      metadata: {
        roleName: role.name,
        exhibitionCount: assignedExhibitions?.length || 0
      }
    });

    res.status(201).json({
      ...userResponse,
      role,
      assignedExhibitions: user.assignedExhibitions || []
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Log failed user creation
    await logActivity(req, {
      action: 'user_created',
      resource: 'user',
      description: `Failed to create user "${req.body.username}"`,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
      newValues: req.body
    });

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
      .populate('assignedExhibitions')
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
 * Update a user by ID
 * This endpoint is for managing admin panel users only
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username, email, name, role: roleInput, isActive, password, assignedExhibitions } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Process role if provided
    let roleId = user.role;
    if (roleInput) {
      try {
        // First try direct match with role name strings
        if (typeof roleInput === 'string') {
          const roleByName = await Role.findOne({ 
            name: { $regex: new RegExp(`^${roleInput}$`, 'i') } 
          });
          
          if (roleByName) {
            roleId = roleByName._id;
          } else {
            // Try to find by ID
            const roleById = await Role.findById(roleInput);
            if (roleById) {
              roleId = roleById._id;
            }
          }
        } else if (roleInput && typeof roleInput === 'object' && roleInput._id) {
          // If it's an object with _id
          roleId = roleInput._id;
        }
      } catch (error) {
        console.error('Error finding role during user update:', error);
        // Continue with existing role if there's an error
      }
    }
    
    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (name) {
      // Handle name as a property on the user object or add it as a custom property
      if ('name' in user) {
        (user as any).name = name;
      } else {
        // If name isn't part of the schema, we can still update it directly
        (user as any).name = name;
      }
    }
    if (roleId) user.role = roleId;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Only update password if it's provided
    if (password) {
      user.password = password;
    }
    
    // Handle exhibition assignments if provided
    if (assignedExhibitions !== undefined) {
      try {
        // Import Exhibition model
        const Exhibition = require('../models/exhibition.model').default;
        
        // Update user's assignedExhibitions field
        user.assignedExhibitions = assignedExhibitions || [];
        
        // First, remove user from all exhibitions
        await Exhibition.updateMany(
          { assignedUsers: userId },
          { $pull: { assignedUsers: userId } }
        );
        
        // Then add user to the new assigned exhibitions
        if (Array.isArray(assignedExhibitions) && assignedExhibitions.length > 0) {
          await Exhibition.updateMany(
            { _id: { $in: assignedExhibitions } },
            { $addToSet: { assignedUsers: userId } }
          );
          
          console.log(`User ${user.username} reassigned to ${assignedExhibitions.length} exhibitions`);
        } else {
          console.log(`User ${user.username} removed from all exhibitions`);
        }
      } catch (assignmentError) {
        console.error('Error updating user exhibition assignments:', assignmentError);
        // Don't fail user update if exhibition assignment fails
      }
    }
    
    // Check if user is being deactivated
    const wasActive = user.isActive;
    const isBeingDeactivated = wasActive && isActive === false;
    
    // Save the updated user
    await user.save();
    
    // If user is being deactivated, emit socket event to force logout
    if (isBeingDeactivated) {
      try {
        // Import socket service
        const { emitUserDeactivated } = require('../services/socket.service');
        emitUserDeactivated(userId);
        console.log(`User ${user.username} deactivated - logout signal sent`);
      } catch (socketError) {
        console.error('Error emitting user deactivation event:', socketError);
        // Don't fail user update if socket emission fails
      }
    }
    
    // Populate the role for response
    await user.populate('role');
    await user.populate('assignedExhibitions');
    
    // Remove password from response
    const userResponse: Record<string, any> = user.toObject();
    if (userResponse.password) {
      delete userResponse.password;
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        ...userResponse,
        assignedExhibitions: user.assignedExhibitions || []
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error instanceof Error ? error.message : String(error)
    });
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