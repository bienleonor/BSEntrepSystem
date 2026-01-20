import { Router } from 'express';
import {
    insertUserDetailsController,
    getUserDetailsByIdController,
    getLoggedInUserDetailsController,
    getUserDetailsController,
} from '../controllers/users-details-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { requireSystemRole, allowSelfOrSuperadmin } from '../middlewares/permission-middleware.js';

const router = Router();

// ============================================
// USER DETAILS ROUTES
// ============================================

// Get current user's own details - any authenticated user
router.get("/me", authenticateToken, getLoggedInUserDetailsController);

// Insert user details for onboarding - authenticated user for their own profile
router.post('/insertUserDetailsController/:id', authenticateToken, insertUserDetailsController);

// ============================================
// ADMIN ROUTES (superadmin only)
// ============================================

// Get all user details - superadmin only
router.get("/", 
  authenticateToken, 
  requireSystemRole('superadmin'), 
  getUserDetailsController
);

// Get specific user details - allow self access (for business creation/promotion) or superadmin
router.get("/:id", 
  authenticateToken, 
  allowSelfOrSuperadmin, 
  getUserDetailsByIdController
);

export default router;