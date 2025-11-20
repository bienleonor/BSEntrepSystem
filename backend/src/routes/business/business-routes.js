import express from "express";
import {
  getBusinessCategories,
  registerBusiness,
  getUserBusiness
} from "../../controllers/business/business-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";

const router = express.Router();

// Public
router.get("/categories", getBusinessCategories);

// Must be logged in
router.post("/registerbusiness", authenticateToken, registerBusiness);
router.get("/mybusinesses", authenticateToken, getUserBusiness);

export default router;
