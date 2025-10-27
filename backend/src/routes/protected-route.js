import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import {
  getUsers,
  getUser,
  addUser,
  editUser,
  removeUser
} from '../controllers/userController.js';

const router = Router();

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);
router.post('/', authenticateToken, addUser);
router.put('/:id', authenticateToken, editUser);
router.delete('/:id', authenticateToken, removeUser);

export default router;