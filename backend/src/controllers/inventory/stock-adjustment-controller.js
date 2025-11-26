// controllers/inventory/stockAdjustmentController.js
import { applyInventoryChange, addStockIn } from "../../services/inventory-services.js";

export const stockAdjustmentController = async (req, res) => {
  try {
    const { type, items } = req.body; // items = [{ productId, quantity, unit_price }]
    const { businessId, userId } = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    switch (type) {
      case "add":
        // stock-in uses your existing addStockIn
        const result = await addStockIn({ businessId, userId, items });
        return res.json({ success: true, message: "Stock-in recorded", data: result });

      case "spoilage":
      case "waste":
      case "correction":
      case "production":
        // for stock-out, correction, production, call applyInventoryChange for each item
        for (const item of items) {
          await applyInventoryChange({
            productId: item.productId,
            change_qty: item.quantity * (type === "spoilage" || type === "waste" ? -1 : 1), 
            reason: type,
            reference: null,
            businessId,
            userId,
          });
        }
        return res.json({ success: true, message: `${type} adjustment applied successfully` });

      default:
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
  } catch (err) {
    console.error("Stock adjustment error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
