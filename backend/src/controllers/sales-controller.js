//sales-controller.js
import { getSalesTotal,createSale,getAllOrders,getAllOrdersByBusiness,cancelSale,finishOrder,getFinishOrderByBusiness } from '../models/sales-model.js';

export const makesale = async (req, res) => {
  try {
    const { items, total_amount,business_id } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }
    const user_id = req.user?.user_id;
    if (!user_id) return res.status(401).json({ error: "Unauthenticated" });

    const saleData = { user_id, total_amount, items, business_id };
    const saleId = await createSale(saleData);

    return res.status(201).json({ sale_id: saleId });
  } catch (err) {
    console.error("makesale error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// controllers/orders.js
export const getAllOrdersController = async (req, res) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) return res.status(403).json({ error: "Business access required" });

    const orders = await getAllOrders(businessId);
    console.log("Fetched orders:", orders.length);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}; 

// Optional: single order by purchase_id
export const getOrderByIdController = async (req, res) => {
  try {
    const { orderId } = req.params; // purchase_id
    const businessId = req.user?.business_id;
    const orders = await getAllOrders(businessId);
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// controllers/sales-controller.js

// make sure you have the helper imported at top of file, for example:
// import { getAllOrdersByBusiness } from '../models/sales/sales-model.js';

export const getAllOrdersByBusinessController = async (req, res) => {
  try {
    console.log('getAllOrdersByBusinessController start', {
      params: req.params,
      businessId_from_middleware: req.businessId,
      user: req.user
    });

    // Prefer middleware value to avoid mismatches
    const bizId = req.businessId ?? (req.params?.businessId ? Number(req.params.businessId) : null);
    if (!bizId) {
      console.log('getAllOrdersByBusinessController: missing bizId');
      return res.status(400).json({ error: 'Missing business id' });
    }

    // Replace this call with your actual model/ORM function.
    // NOTE: pass bizId (not businessId or other undefined var).
    const orders = await getAllOrdersByBusiness(bizId);

    console.log('getAllOrdersByBusinessController: orders count', Array.isArray(orders) ? orders.length : null);

    if (!orders || (Array.isArray(orders) && orders.length === 0)) {
      return res.status(404).json({ error: 'Orders not found' });
    }

    return res.json(orders);
  } catch (err) {
    console.error('getAllOrdersByBusinessController error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const cancelSaleController = async (req, res) => {
    const { purchaseId } = req.params; // route: /sales/:purchaseId/cancel

    try {
      await cancelSale(purchaseId);
      return res.status(200).json({
        success: true,
        message: `Sale ${purchaseId} canceled successfully`
      });
    } catch (err) {
      if (err.message.includes('not found')) {
        return res.status(404).json({ success: false, error: err.message });
      }
      if (err.message.includes('Inventory update failed')) {
        return res.status(409).json({ success: false, error: err.message });
      }

      console.error('Cancel sale error:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const finishOrderController = async (req, res) => {
  const { purchaseId } = req.params; // route: /sales/:purchaseId/finish

  try {
    await finishOrder(purchaseId);
    return res.status(200).json({
      success: true,
      message: `Order ${purchaseId} finished successfully`
    });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ success: false, error: err.message });
    }
    if (err.message.includes('already finished')) {
      return res.status(409).json({ success: false, error: err.message });
    }
    if (err.message.includes('canceled')) {
      return res.status(409).json({ success: false, error: err.message });
    }

    console.error('Finish order error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const GetFinishOrderByBusiness = async (req, res) => {
  try {
    const businessId = req.businessId; // ✅ comes from middleware
    if (!businessId) {
      return res.status(400).json({ error: "Missing business context" });
    }

    // Extract pagination options from query params
    const opts = {
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 25
    };

    const result = await getFinishOrderByBusiness(businessId, opts);

    res.json({
      orders: result.orders,
      meta: result.meta
    });
  } catch (err) {
    console.error("Error in GetFinishOrderByBusiness:", err);
    res.status(500).json({ error: err.message });
  }
};

export const GetAllTotalSales = async (req, res) => {
  try {
    const businessId = req.businessId;   // ✅ comes from middleware
    if (!businessId) {
      return res.status(400).json({ error: "Missing business context" });
    }

    const result = await getSalesTotal(businessId);
    res.json({ total_sales: result.total_sales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
