import express from 'express';
import { authenticateToken } from '../../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../../middlewares/business-access.js';
import { getBusinessLogsController } from '../../controllers/business/business-logs-controller.js';

const router = express.Router();

// GET /business/:business_id/logs?limit=50&offset=0
router.get('/:business_id/logs', authenticateToken, requireBusinessAccess, getBusinessLogsController);

export default router;
