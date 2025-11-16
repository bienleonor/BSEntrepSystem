import { getSalesTotal,createSale,getAllOrders,getAllOrdersByBusiness} from '../models/sales-model.js';
import { findRoleByName } from '../models/role-model.js'; 



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



// Controller that uses your helper
export const getAllOrdersByBusinessController = async (req, res) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) {
      return res.status(403).json({ error: "Business access required" });
    }

    // ✅ Use the helper with JOIN
    const orders = await getAllOrdersByBusiness(businessId);

    return res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    return res.status(500).json({ error: err.message });
  }
};


/*
export const getOrderByIdController = async (req, res) => {
  try {
    const businessId = req.user?.business_id;
    if (!businessId) return res.status(403).json({ error: "Business access required" });

    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: "Missing orderId" });

    const orders = await getAllOrdersByBusiness(businessId);
    const order = orders.find(o => String(o.purchaseId) === String(orderId));
    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
*/


export const GetAllTotalSales = async (req, res) => {
  try {
    const businessId = req.user.business_id;
    const roleName = req.user.role;

    const result = await getSalesTotal(businessId);
    const roleDetails = await findRoleByName(roleName);

    res.json({
      total_sales: result.total_sales,
      role: roleDetails // or roleDetails.role_name, depending on what you want to expose
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
