import express from "express";
import {
  stockInController,
  stockOutController,
  correctionController,
  productionController,
} from "../../controllers/inventory/inventory-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";

const router = express.Router();

// Add stock (purchase)
router.post("/stockin", authenticateToken, stockInController);

// Stock-out: spoilage/waste
router.post("/stockout", authenticateToken, stockOutController);

// Manual correction
router.post("/correction", authenticateToken, correctionController);

// Production
router.post("/production", authenticateToken, productionController);

export default router;
