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
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { requireSystemRole } from '../middlewares/permission-middleware.js';

const router = Router();

// ============================================
// USER MANAGEMENT ROUTES (Requires superadmin role)
// These are system-level user operations, not business employees
// ============================================

// Get all users - superadmin only
router.get('/', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  getUsers
);

// Search users - superadmin only
router.get('/search', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  searchUsers
);

// Lookup by username - superadmin only
router.get('/lookup', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  lookupUserByUsername
);

// Get a single user by ID - superadmin only
router.get('/:id', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  getUserById
);

// Create a new user (admin registration) - superadmin only
router.post('/', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  addUser
);

// Update a user - superadmin only
router.put('/:id', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  editUser
);

// Delete a user - superadmin only
router.delete('/:id', 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  removeUser
);

export default router;