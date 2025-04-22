import express from 'express';
import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
} from '../controllers/role.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getRoles)
  .post(authorize('admin'), createRole);

router
  .route('/:id')
  .get(getRole)
  .put(authorize('admin'), updateRole)
  .delete(authorize('admin'), deleteRole);

export default router; 