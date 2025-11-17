import pool from '../config/pool.js';
import { Router } from 'express';
import { GetAllTotalSales, makesale,getAllOrdersController,getOrderByIdController,getAllOrdersByBusinessController, cancelSaleController,finishOrderController} from '../controllers/sales-controller.js';
 


const router = Router();

// Middleware to ensure user has business access
const requireBusinessAccess = (req, res, next) => {
  if (!req.user || !req.user.business_id) {
    return res.status(403).json({ message: 'Forbidden: No business access' });
  }
  next();
};

// Get total sales for the user's business only
router.get('/total_amount', requireBusinessAccess, GetAllTotalSales);
router.post('/create', requireBusinessAccess, makesale);
router.get('/orders', requireBusinessAccess, getAllOrdersController);
router.get('/orders/:orderId', requireBusinessAccess, getOrderByIdController);
router.get('/businesses/:businessId/orders', requireBusinessAccess, getAllOrdersByBusinessController);
router.delete('/businesses/:businessId/orders/:purchaseId',requireBusinessAccess,cancelSaleController);
router.post('/businesses/:businessId/orders/:purchaseId/finish',requireBusinessAccess,finishOrderController
);








export default router;
