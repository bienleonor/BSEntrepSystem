import { Router } from 'express';
import { login, register } from '../controllers/auth-controller.js';
// import { selectBusiness } from "../controllers/business/business-controller.js";
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { upgradeUserRole } from '../controllers/sys-user-role-cotroller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post("/upgrade-role", upgradeUserRole);
// router.post("/selectbusiness", authenticateToken,selectBusiness);

export default router;