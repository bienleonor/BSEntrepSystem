import express from "express";
import { stockInController } from "../../controllers/inventory/stockin-controller.js";
import { authenticateToken } from "../../middlewares/auth-middleware.js";
import { requireBusinessAccess } from "../../middlewares/business-access.js";
import { requirePermission } from "../../middlewares/permission-middleware.js";

const router = express.Router();

// Stock-in requires stockin:create permission
router.post("/stockin", 
  authenticateToken, 
  requireBusinessAccess,
  requirePermission('stockin:create'),
  stockInController
);

export default router;
