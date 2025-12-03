import { Router } from 'express';
import pool from '../config/pool.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { requireSystemRole } from '../middlewares/permission-middleware.js';

const router = Router();

// ============================================
// SUPERADMIN METRICS (Requires superadmin role only)
// ============================================
router.get('/', 
  authenticateToken, 
  requireSystemRole('superadmin'),
  async (req, res) => {
    try {
      const [[usersCount]] = await pool.query('SELECT COUNT(*) AS total_users FROM user_table');
      const [[rolesCount]] = await pool.query('SELECT COUNT(*) AS total_roles FROM system_role_table');

      // Active sessions placeholder: if you track sessions, replace this with real logic
      const active_sessions = 0;

      // Pending approvals placeholder
      const pending_approvals = 0;

      // Storage usage placeholder (requires infra metrics)
      const storage_usage_gb = null;

      res.json({
        total_users: usersCount.total_users || 0,
        total_roles: rolesCount.total_roles || 0,
        active_sessions,
        pending_approvals,
        storage_usage_gb,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

export default router;
