import express from 'express';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { requirePermission } from '../../middlewares/permission-middleware.js';
import { getBusinessLogsController, getBusinessLogDatesController, exportBusinessLogsByDateController } from '../../controllers/business/business-logs-controller.js';

const router = express.Router();

// ============================================
// BUSINESS LOGS ROUTES (Requires analytics:read permission)
// ============================================

// GET /business/:business_id/logs?limit=50&offset=0
router.get('/:business_id/logs', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('audit_logs:read'),
  getBusinessLogsController
);

// Available dates for which logs exist
router.get('/:business_id/logs/dates', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('audit_logs:read'),
  getBusinessLogDatesController
);

// CSV export by date
router.get('/:business_id/logs/export', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('audit_logs:export'),
  exportBusinessLogsByDateController
);

export default router;
