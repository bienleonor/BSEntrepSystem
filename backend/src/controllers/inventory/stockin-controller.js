import { addStockIn } from "../../services/inventory-services.js";

export async function stockInController(req, res) {
  try {
    const { items } = req.body;
    const { businessId, userId } = req.user; // assuming from JWT

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const result = await addStockIn({
      businessId,
      userId,
      items,
    });

    return res.status(200).json({
      success: true,
      message: "Stock-in recorded successfully",
      data: result,
    });
  } catch (err) {
    console.error("Stock-in error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
