import express from 'express';
import { getUsers, deleteUser, createUser } from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.post('/', authorize('admin'), createUser);
router.get('/', authorize('admin'), getUsers);
router.delete('/:id', authorize('admin'), deleteUser);

export default router; 