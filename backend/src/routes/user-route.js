import { Router } from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  editUser,
  removeUser,insertUserDetailsController,
} from '../controllers/user-controllers.js';

const router = Router();

// Get all users
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Create a new user (registration)
router.post('/', addUser);

// Update a user
router.put('/:id', editUser);

// Delete a user
router.delete('/:id', removeUser);

//get users
router.post('/insertUserDetailsController/:id', insertUserDetailsController);




export default router;