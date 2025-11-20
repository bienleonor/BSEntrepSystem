// sales-route.js
import { Router } from 'express';
import {
  GetAllTotalSales,
  makesale,
  getAllOrdersController,
  getOrderByIdController,
  getAllOrdersByBusinessController,
  cancelSaleController,
  finishOrderController,GetFinishOrderByBusiness,
} from '../controllers/sales-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../middlewares/business-access.js'; // ✅ Import the real middleware

const router = Router();

// ❌ REMOVE THIS - you already have a better one in business-access.js
// const requireBusinessAccess = (req, res, next) => {
//   const businessId = req.headers['x-business-id'];
//
//   if (!businessId) {
//     return res.status(403).json({ message: 'Forbidden: No business selected' });
//   }
//
//   req.businessId = businessId; // attach to request for controllers
//   next();
// };

// Routes
router.get('/total_amount', authenticateToken, requireBusinessAccess, GetAllTotalSales);
router.post('/create', authenticateToken, requireBusinessAccess, makesale);
router.get('/orders', authenticateToken, requireBusinessAccess, getAllOrdersController);
router.get('/orders/:orderId', authenticateToken, requireBusinessAccess, getOrderByIdController);
router.get('/saleslog',authenticateToken,requireBusinessAccess,GetFinishOrderByBusiness);


// If businesses/:businessId still needed:
router.get('/businesses/:businessId/orders', authenticateToken, requireBusinessAccess, getAllOrdersByBusinessController);
router.delete('/businesses/:businessId/orders/:purchaseId', authenticateToken, requireBusinessAccess, cancelSaleController);
router.post('/businesses/:businessId/orders/:purchaseId/finish', authenticateToken, requireBusinessAccess, finishOrderController);

export default router;