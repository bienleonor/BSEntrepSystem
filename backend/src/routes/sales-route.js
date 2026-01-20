// sales-route.js
import { Router } from 'express';
import {
  GetAllTotalSales,
  makesale,
  getAllOrdersController,
  getOrderByIdController,
  getAllOrdersByBusinessController,
  cancelSaleController,
  finishOrderController,
  GetFinishOrderByBusiness,
} from '../controllers/sales-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { requireBusinessAccess } from '../middlewares/business-access.js';
import { requirePermission } from '../middlewares/permission-middleware.js';

const router = Router();

// ============================================
// SALES READ ROUTES (Requires sales:read)
// ============================================
router.get('/total_amount', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('sales:read'), 
  GetAllTotalSales
);

router.get('/saleslog', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('sales:read'), 
  GetFinishOrderByBusiness
);

// ============================================
// ORDER ROUTES (Requires order:* permissions)
// ============================================
router.get('/orders', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('order:read'), 
  getAllOrdersController
);

router.get('/orders/:orderId', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('order:read'), 
  getOrderByIdController
);

router.get('/businesses/:businessId/orders', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('order:read'), 
  getAllOrdersByBusinessController
);

// ============================================
// SALES CREATE ROUTES (Requires sales:create)
// ============================================
router.post('/create', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('sales:create'), 
  makesale
);

// Finish order uses order:update
router.post('/businesses/:businessId/orders/:purchaseId/finish', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('order:update'), 
  finishOrderController
);

// ============================================
// ORDER CANCEL ROUTES (Requires order:cancel)
// ============================================
router.delete('/businesses/:businessId/orders/:purchaseId', 
  authenticateToken, 
  requireBusinessAccess, 
  requirePermission('order:cancel'), 
  cancelSaleController
);

export default router;