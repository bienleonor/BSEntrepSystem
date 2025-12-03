import express from "express";
import {
  stockInController,
  stockOutController,
  correctionController,
  productionController,
  getInventoryTransactionsController,
} from "../../controllers/inventory/inventory-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";
import { requireBusinessAccess } from "../../middlewares/business-access.js";
import { requirePermission } from "../../middlewares/permission-middleware.js";

const router = express.Router();

// ============================================
// INVENTORY ADJUSTMENT ROUTES (Requires inventory permission)
// ============================================

// Stock-in (purchase) - requires stockin:create
router.post("/stockin", 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('stockin:create'), 
  stockInController
);

// Stock-out (spoilage/waste) - requires stock_adjustment:create
router.post("/stockout", 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('stock_adjustment:create'), 
  stockOutController
);

// Manual correction - requires stock_adjustment:update
router.post("/correction", 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('stock_adjustment:update'), 
  correctionController
);

// Production - requires production:create
router.post("/production", 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('production:create'), 
  productionController
);

// Get inventory transactions - accessible to all authenticated business members
// Everyone can view stock adjustment logs/reports as read-only
router.get("/transactions", 
  authenticateToken, 
  requireBusinessAccess, 
  getInventoryTransactionsController
);

export default router;
