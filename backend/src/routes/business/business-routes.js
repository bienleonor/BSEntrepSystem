import express from "express";
import {
  getBusinessCategories,
  registerBusiness,
  getUserBusiness
} from "../../controllers/business/business-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";
import multer from 'multer';
import { localStorage } from '../../config/storage.js';
import { getSettings, updateSettings } from '../../controllers/business/business_settings-controller.js';
import { getAllPositions,addPosition } from "../../controllers/business/business-position-controller.js";

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

//business position
router.get("/position", getAllPositions);
router.post("/addposition",addPosition);
export default router;
