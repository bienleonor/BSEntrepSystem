import express from "express";
import {
  getBusinessCategories,
  registerBusiness,
  getUserBusiness, getBusinessAccessCode
} from "../../controllers/business/business-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";
import multer from 'multer';
import { localStorage } from '../../config/storage.js';
import { getSettings, updateSettings,getLogo  } from '../../controllers/business/business_settings-controller.js';
import { getAllPositions,addPosition } from "../../controllers/business/business-position-controller.js";
import { getEmployeesByBusiness, addEmployee, assignPosition, removeEmployee, } from "../../controllers/business/business-employee-controller.js";
import { requireBusinessAccess } from "../../middlewares/business-access.js";



const router = express.Router();

// Public
router.get("/categories", getBusinessCategories);

// Must be logged in
router.post("/registerbusiness", authenticateToken, registerBusiness);
router.get("/mybusinesses", authenticateToken, getUserBusiness);

// Business settings (uses local storage for logo uploads)
const uploadLocal = multer({ storage: localStorage });
router.get('/settings', authenticateToken, getSettings);
router.post('/settings', authenticateToken, uploadLocal.single('logo'), updateSettings);
router.get("/:business_id/logo", authenticateToken, getLogo);

//business position
router.get("/position", getAllPositions);
router.post("/addposition",addPosition);

//employee
// Get employees for a business
router.get('/employees/:business_id', authenticateToken, getEmployeesByBusiness);

// Add an employee (admin or via access-code flow)
router.post('/addemployee', authenticateToken, addEmployee);

// Assign/update position for an employee
router.post('/assign-position', authenticateToken, assignPosition);

// Remove employee
router.delete('/removeemployee', authenticateToken, removeEmployee);

router.get(
  "/access-code", authenticateToken, requireBusinessAccess, getBusinessAccessCode );

export default router;
