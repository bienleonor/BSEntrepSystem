import { 
  addStockIn, 
  applyMultiInventoryChange,
  processProduction  // ✅ Add this import
} from "../../services/inventory-services.js";

// Stock-in controller (Add Stocks)

export const stockInController = async (req, res) => {
  console.log("📥 Stock-in Headers:", req.headers);
  console.log("📦 Stock-in Body:", req.body);
  console.log("👤 User:", req.user);

  try {
    const { businessId, userId, items } = req.body;

    // Validate required fields
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing or invalid items array" });
    }

    // Call service
    const result = await addStockIn(req.body);
    
    res.status(200).json({
      success: true,
      message: "Stock added successfully",
      data: result
    });

  } catch (err) {
    console.error("❌ Stock-in error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Internal server error" 
    });
  }
};


//  Stock-out controller (Spoilage / Wastage)

export const stockOutController = async (req, res) => {
  console.log("📥 Stock-out Body:", req.body);

  try {
    const { businessId, userId, items } = req.body;

    // Validate required fields
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing or invalid items array" });
    }

    // Default reason to 'waste' (can be customized based on frontend later)
    const reason = req.body.reason || "waste";

    // Validate reason
    if (!["spoilage", "waste"].includes(reason)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid reason. Must be 'spoilage' or 'waste'" 
      });
    }

    // Call service
    const result = await applyMultiInventoryChange({
      items,
      reason,
      businessId,
      userId
    });
    
    res.status(200).json({
      success: true,
      message: `Stock-out (${reason}) recorded successfully`,
      data: result
    });

  } catch (err) {
    console.error("❌ Stock-out error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Internal server error" 
    });
  }
};


//  Correction controller (Stock Adjustment)

export const correctionController = async (req, res) => {
  console.log("📥 Correction Body:", req.body);

  try {
    const { businessId, userId, items } = req.body;

    // Validate required fields
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing or invalid items array" });
    }

    // Call service
    const result = await applyMultiInventoryChange({
      items,
      reason: "correction",
      businessId,
      userId
    });
    
    res.status(200).json({
      success: true,
      message: "Stock correction recorded successfully",
      data: result
    });

  } catch (err) {
    console.error("❌ Correction error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Internal server error" 
    });
  }
};


// Production controller
export const productionController = async (req, res) => {
  console.log("📥 Production Body:", req.body);

  try {
    const { businessId, userId, items } = req.body;

    // Validate required fields
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing or invalid items array" });
    }

    const result = await processProduction({
      items,
      businessId,
      userId
    });
    
    res.status(200).json({
      success: true,
      message: "Production recorded successfully",
      data: result
    });

  } catch (err) {
    console.error("❌ Production error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Internal server error" 
    });
  }
};

export default {
  stockInController,
  stockOutController,
  correctionController,
  productionController
};