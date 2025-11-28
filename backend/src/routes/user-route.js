import { Router } from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  editUser,
  removeUser,
  lookupUserByUsername,
  searchUsers,
} from '../controllers/user-controllers.js';



const router = Router();

// Get all users
router.get('/', getUsers);

// Lookup by username (placed before :id to avoid route conflict)
router.get('/search', searchUsers); // partial search first
router.get('/lookup', lookupUserByUsername); // exact lookup

// Get a single user by ID
router.get('/:id', getUserById);

// Create a new user (registration)
router.post('/', addUser);

// Update a user
router.put('/:id', editUser);

// Delete a user
router.delete('/:id', removeUser);


export default router;