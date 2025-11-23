import { Router } from 'express';
import {
    insertUserDetailsController,
    getUserDetailsByIdController,
    getLoggedInUserDetailsController,
    getUserDetailsController,
} from '../controllers/users-details-controller.js';

import { authenticateToken } from '../middlewares/auth-middleware.js'


const router = Router();

router.get("/", getUserDetailsController);

router.get("/:id", getUserDetailsByIdController);

router.get("/me", authenticateToken, getLoggedInUserDetailsController);

//get users
router.post('/insertUserDetailsController/:id', insertUserDetailsController);



export default router;