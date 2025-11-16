import { Router } from 'express';
import { login, register } from '../controllers/auth-controller.js';
import { selectBusiness } from "../controllers/business/business-controller.js";
import { authenticateToken } from '../middlewares/auth-middleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post("/selectbusiness", authenticateToken,selectBusiness);

export default router;