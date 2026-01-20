import express from "express";
import {
  getBusinessCategories,
  registerBusiness,
  getUserBusiness, getBusinessAccessCode, getAllBusinessescontroller, deleteBusinessController
} from "../../controllers/business/business-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";
import multer from 'multer';
import { localStorage } from '../../config/storage.js';
import { getSettings, updateSettings, getLogo } from '../../controllers/business/business_settings-controller.js';
import { getAllPositions, addPosition } from "../../controllers/business/business-position-controller.js";
import { getEmployeesByBusiness, addEmployee, assignPosition, removeEmployee } from "../../controllers/business/business-employee-controller.js";
import { requireBusinessAccess } from "../../middlewares/business-access.js";
import { requirePermission } from "../../middlewares/permission-middleware.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================
router.get("/categories", getBusinessCategories);

// ============================================
// AUTH ONLY (No specific business/permission needed)
// ============================================
router.post("/registerbusiness", authenticateToken, registerBusiness);
router.get("/mybusinesses", authenticateToken, getUserBusiness);

// ============================================
// ADMIN/SUPERADMIN ROUTES (business_settings permission)
// Superadmin bypasses requirePermission automatically
// ============================================
router.get("/businesses", 
  authenticateToken, 
  requirePermission('business_settings:read'), 
  getAllBusinessescontroller
);

router.delete("/deletebusiness/:businessId", 
  authenticateToken, 
  requirePermission('business_settings:delete'), 
  deleteBusinessController
);

// ============================================
// BUSINESS SETTINGS (Requires business_settings permission)
// ============================================
const uploadLocal = multer({ storage: localStorage });

router.get('/settings', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('business_settings:read'), 
  getSettings
);

router.post('/settings', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('business_settings:update'), 
  uploadLocal.single('logo'), 
  updateSettings
);

router.get("/:business_id/logo", authenticateToken, getLogo);

// ============================================
// POSITIONS (Requires role_permission)
// ============================================
router.get("/position", 
  authenticateToken, 
  requirePermission('role_permission:read'), 
  getAllPositions
);

router.post("/addposition", 
  authenticateToken, 
  requirePermission('role_permission:create'), 
  addPosition
);

// ============================================
// EMPLOYEES (Requires user_management permission)
// Note: Users join via /api/access-code/enter (no permission needed)
//       These routes are for admins managing employees
// ============================================
router.get('/employees/:business_id', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('user_management:read'), 
  getEmployeesByBusiness
);

// Admin adds employee directly (not via access code)
router.post('/addemployee', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('user_management:create'), 
  addEmployee
);

router.post('/assign-position', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('user_management:update'), 
  assignPosition
);

router.delete('/removeemployee', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('user_management:delete'), 
  removeEmployee
);

// ============================================
// ACCESS CODE
// ============================================
router.get("/access-code", 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('business_settings:read'), 
  getBusinessAccessCode
);

export default router;
