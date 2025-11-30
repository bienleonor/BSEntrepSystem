import { 
  addStockIn, 
  applyMultiInventoryChange,
  processProduction, 
} from "../../services/inventory-services.js";
import { logBusinessAction } from '../../services/business-logs-service.js';
import { MODULES, ACTIONS } from '../../constants/modules-actions.js';

import { getAllInventoryTransactions } from "../../models/inventory/inventory-model.js";

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

    try {
      await logBusinessAction({
        business_id: Number(businessId),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.INVENTORY,
        action_id: ACTIONS.CREATE,
        table_name: 'inventory_table',
        record_id: 0,
        old_data: null,
        new_data: { items_count: items.length, type: 'stock_in' },
        req,
      });
    } catch (e) {}

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
  console.log("📥 Stock-out Headers:", req.headers);
  console.log("📦 Stock-out Body:", req.body);
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

    try {
      await logBusinessAction({
        business_id: Number(businessId),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.INVENTORY,
        action_id: ACTIONS.UPDATE,
        table_name: 'inventory_table',
        record_id: 0,
        old_data: null,
        new_data: { items_count: items.length, type: 'stock_out', reason },
        req,
      });
    } catch (e) {}

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
  console.log("📥 Correction Headers:", req.headers);
  console.log("📦 Correction Body:", req.body);
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

    try {
      await logBusinessAction({
        business_id: Number(businessId),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.INVENTORY,
        action_id: ACTIONS.UPDATE,
        table_name: 'inventory_table',
        record_id: 0,
        old_data: null,
        new_data: { items_count: items.length, type: 'correction' },
        req,
      });
    } catch (e) {}

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
  console.log("📥 Production Headers:", req.headers);
  console.log("📦 Production Body:", req.body);
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
    const result = await processProduction({ items, businessId, userId });

    res.status(200).json({
      success: true,
      message: "Production recorded successfully",
      data: result
    });

    try {
      await logBusinessAction({
        business_id: Number(businessId),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.INVENTORY,
        action_id: ACTIONS.CREATE,
        table_name: 'inventory_table',
        record_id: 0,
        old_data: null,
        new_data: { items_count: items.length, type: 'production' },
        req,
      });
    } catch (e) {}

  } catch (err) {
    console.error("❌ Production error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Internal server error" 
    });
  }
};

export const getInventoryTransactionsController = async (req, res) => {
  console.log("📥 Get Inventory Transactions Headers:", req.headers);
  console.log("👤 User:", req.user) ;
  try {
    const businessId = req.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: "Missing businessId" });
    }
    const transactions = await getAllInventoryTransactions(businessId);
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (err) {
    console.error("❌ Get Inventory Transactions error:", err);
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