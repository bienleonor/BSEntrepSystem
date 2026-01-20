import express from "express";
import {
  generateAccessCode,
  enterAccessCode,
  getAllSections,
  getAllGroups,
  getAllSchoolYear,
} from "../controllers/access-codes-controller.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";
import { requireBusinessAccess } from "../middlewares/business-access.js";
import { requirePermission } from "../middlewares/permission-middleware.js";

const router = express.Router();

// ============================================
// ACCESS CODE ROUTES
// ============================================

// Generate access code - requires business_settings:update (admins/managers)
router.post("/generate", 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('business_settings:update'),
  generateAccessCode
);

// Enter access code - any authenticated user can join a business (self-service)
// No business access required since they're joining
router.post("/enter", 
  authenticateToken, 
  enterAccessCode
);

// ============================================
// LOOKUP DATA (Public or auth-only)
// ============================================
router.get("/sections", getAllSections);
router.get("/groups", getAllGroups);
router.get("/schoolyears", getAllSchoolYear);

export default router;
