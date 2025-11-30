//sales-controller.js
import { getSalesTotal,createSale,getAllOrders,getAllOrdersByBusiness,cancelSale,finishOrder,getFinishOrderByBusiness, getOrderItemsByPurchaseId } from '../models/sales-model.js';
import { logBusinessAction } from '../services/business-logs-service.js';
import { MODULES, ACTIONS } from '../constants/modules-actions.js';

export const makesale = async (req, res) => {
  try {
    const { items, total_amount,business_id } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }
    const user_id = req.user?.user_id;
    if (!user_id) return res.status(401).json({ error: "Unauthenticated" });

    const bizId = Number(req.businessId || business_id);
    const saleData = { user_id, total_amount, items, business_id: bizId };
    const sale = await createSale(saleData);

    // Fire-and-forget logging (don't block response)
    (async () => {
      try {
        // Log the purchase (sale) record
        await logBusinessAction({
          business_id: bizId,
          user_id,
          module_id: MODULES.SALES,
          action_id: ACTIONS.CREATE,
          table_name: 'purchases_table',
          record_id: Number(sale.sale_id || 0),
          old_data: null,
          new_data: { sale_id: sale.sale_id, total_amount, items_count: items.length, receipt_no: sale.custom_receipt_no },
          req,
        });

        // Log each purchase item and related inventory decrement
        const createdItems = await getOrderItemsByPurchaseId(sale.sale_id);
        for (const it of createdItems) {
          await logBusinessAction({
            business_id: bizId,
            user_id,
            module_id: MODULES.SALES,
            action_id: ACTIONS.CREATE,
            table_name: 'purchase_items_table',
            record_id: Number(it.itemId || 0),
            old_data: null,
            new_data: { purchase_id: it.purchaseId, product_id: it.product_id, quantity: it.quantity, price: it.price },
            req,
          });

          await logBusinessAction({
            business_id: bizId,
            user_id,
            module_id: MODULES.INVENTORY,
            action_id: ACTIONS.UPDATE,
            table_name: 'inventory_table',
            record_id: Number(it.product_id || 0),
            old_data: null,
            new_data: { product_id: it.product_id, delta: -Math.abs(Number(it.quantity || 0)) },
            req,
          });
        }
      } catch (e) {
        console.warn('sales logging (create) failed:', e?.message);
      }
    })();

    return res.status(201).json(sale);

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

      // Fire-and-forget logs for cancel + inventory restoration
      (async () => {
        try {
          const bizId = Number(req.businessId || 0);
          const userId = req.user?.user_id ?? null;

          await logBusinessAction({
            business_id: bizId,
            user_id: userId,
            module_id: MODULES.SALES,
            action_id: ACTIONS.CANCEL,
            table_name: 'transaction_table',
            record_id: Number(purchaseId),
            old_data: { purchase_id: Number(purchaseId) },
            new_data: null,
            req,
          });

          // Per-item inventory restore logs
          const items = await getOrderItemsByPurchaseId(purchaseId);
          for (const it of items) {
            await logBusinessAction({
              business_id: bizId,
              user_id: userId,
              module_id: MODULES.INVENTORY,
              action_id: ACTIONS.UPDATE,
              table_name: 'inventory_table',
              record_id: Number(it.product_id || 0),
              old_data: null,
              new_data: { product_id: it.product_id, delta: Math.abs(Number(it.quantity || 0)) },
              req,
            });
          }
        } catch (e) {
          console.warn('sales logging (cancel) failed:', e?.message);
        }
      })();

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

    // Fire-and-forget transaction finish log
    (async () => {
      try {
        await logBusinessAction({
          business_id: Number(req.businessId || 0),
          user_id: req.user?.user_id ?? null,
          module_id: MODULES.SALES,
          action_id: ACTIONS.UPDATE,
          table_name: 'transaction_table',
          record_id: Number(purchaseId),
          old_data: null,
          new_data: { purchase_id: Number(purchaseId), status: 'finished' },
          req,
        });
      } catch (e) {
        console.warn('sales logging (finish) failed:', e?.message);
      }
    })();

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
    const businessId = req.businessId;
    if (!businessId) {
      return res.status(400).json({ error: "Missing business context" });
    }

    const result = await getSalesTotal(businessId);
    res.json(result); // ✅ sends { total_sales: ... }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};