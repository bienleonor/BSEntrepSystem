import express from 'express';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireSystemRole } from '../../middlewares/permission-middleware.js';
import { getUnifiedAuditLogsController } from '../../controllers/audit-logs-controller.js';

const router = express.Router();

// ============================================
// ADMIN ROUTES (Requires superadmin or admin role)
// ============================================

// GET /api/admin/audit-logs?limit=200&offset=0
router.get('/audit-logs', 
  authenticateToken, 
  requireSystemRole('superadmin', 'admin'),
  getUnifiedAuditLogsController
);

export default router;