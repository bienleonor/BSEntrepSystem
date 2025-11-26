// controllers/inventory/production-controller.js
import { applyInventoryChange  } from "../../services/inventory-services.js";


export const createProduction = async (req, res) => {
  try {
    const { product_id, quantity_produced } = req.body;

    if (!product_id || !quantity_produced) {
      return res.status(400).json({
        error: "product_id and quantity_produced are required",
      });
    }

    const quantity = Number(quantity_produced);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        error: "quantity must be a positive number",
      });
    }

    const business_id = req.businessId ?? req.headers["x-business-id"] ?? null;
    const user_id = req.user?.user_id ?? null;

    const result = await applyInventoryChange({
      productId: product_id,
      change_qty: quantity,       // production ALWAYS increases stock
      reason: "production",
      reference: null,
      businessId: business_id,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      message: "Production recorded successfully",
      ...result,
    });
  } catch (err) {
    console.error("createProduction error:", err);
    return res.status(500).json({
      error: "Failed to record production",
    });
  }
};
