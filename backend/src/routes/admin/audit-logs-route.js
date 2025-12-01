import express from 'express';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { getUnifiedAuditLogsController } from '../../controllers/audit-logs-controller.js';

const router = express.Router();

// GET /api/admin/audit-logs?limit=200&offset=0
router.get('/audit-logs', authenticateToken, getUnifiedAuditLogsController);

export default router;