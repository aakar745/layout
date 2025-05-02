import { Request, Response } from 'express';
import Role from '../models/role.model';

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error getting roles', error });
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error getting role', error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    // First check if this is the Administrator role
    const existingRole = await Role.findById(req.params.id);
    if (!existingRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Prevent editing of the Administrator role
    if (existingRole.name === 'Administrator') {
      return res.status(403).json({ 
        message: 'The Administrator role cannot be modified for security reasons'
      });
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    // First check if this is the Administrator role
    const existingRole = await Role.findById(req.params.id);
    if (!existingRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Prevent deletion of the Administrator role
    if (existingRole.name === 'Administrator') {
      return res.status(403).json({ 
        message: 'The Administrator role cannot be deleted for security reasons'
      });
    }

    const role = await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
}; 