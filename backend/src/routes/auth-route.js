import { Router } from 'express';
import { login, register } from '../controllers/auth-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { getEffectivePermissions } from '../repositories/permissionRepository.js';
// import { selectBusiness } from "../controllers/business/business-controller.js";
import { upgradeUserRole } from '../controllers/sys-user-role-cotroller.js';
import { getAllSystemRoles } from '../models/sys-role-model.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post("/upgrade-role", upgradeUserRole);
router.get('/roles', async (req, res) => {
	try {
		const roles = await getAllSystemRoles();
		res.json(roles);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});
// router.post("/selectbusiness", authenticateToken,selectBusiness);

// Return current user payload, businesses and effective permissions for active business
router.get('/me', authenticateToken, async (req, res) => {
	try {
		const user = req.user; // set by authenticateToken
		const businessId = req.headers['x-business-id'] || null;

		const permissions = await getEffectivePermissions({
			systemRoleName: user.system_role,
			userId: user.user_id || user.id,
			businessId
		});

		res.json({ user, permissions });
	} catch (e) {
		console.error('GET /auth/me error:', e);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;