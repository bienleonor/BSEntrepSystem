import { 
  recordInventoryTransactionAndUpdateInventory, 
  getProductById 
} from "../models/inventory/product-model.js";
import { createStockIn, insertStockInItems } from "../models/inventory/stockin-model.js";
import { getIngredientsByProduct } from "../models/inventory/recipe-model.js";
import { getComboByParent } from "../models/inventory/combo-model.js";
import {
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  lockInventory,
  createInventoryRow,
  updateInventoryQty,
  insertInventoryTransaction
} from "../models/inventory/inventory-model.js";
import { insertProduction } from "../models/inventory/production-model.js";

/**
 * Stock-in (purchase)
 * Expects: { businessId, userId, items: [{ productId, quantity, unit_price }] }
 */
export async function addStockIn(data) {
  const { businessId, userId, items } = data;

  // Validation
  if (!businessId) throw new Error("Missing businessId");
  if (!userId) throw new Error("Missing userId");
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Missing or invalid items array");
  }

  // Validate each item
  for (const item of items) {
    if (!item.productId || !item.quantity) {
      throw new Error("Each item must have productId and quantity");
    }
    if (Number(item.quantity) <= 0) {
      throw new Error(`Invalid quantity for product ${item.productId}`);
    }
  }

  // Calculate total amount
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price || 0),
    0
  );

  if (isNaN(totalAmount)) {
    throw new Error("Computed totalAmount is NaN — check quantity/unit_price");
  }

  // Create stock-in record
  const stockinId = await createStockIn({ businessId, userId, totalAmount });
  
  // Insert stock-in items
  await insertStockInItems(stockinId, items);

  // Update inventory for each item
  for (const item of items) {
    await recordInventoryTransactionAndUpdateInventory({
      productId: item.productId,
      change_qty: Number(item.quantity),
      reason: "purchase",
      businessId,
      userId,
      reference: `stockin:${stockinId}`,
      unit_price: Number(item.unit_price)
    });
  }

  return { stockinId, totalAmount };
}

/**
 * Generic inventory adjustment (stock-out, correction)
 * Expects: { items, reason, businessId, userId }
 */
export async function applyMultiInventoryChange(data) {
  const { items, reason, businessId, userId } = data;

  // Validation
  if (!businessId) throw new Error("Missing businessId");
  if (!userId) throw new Error("Missing userId");
  if (!reason) throw new Error("Missing reason");
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Missing or invalid items array");
  }

  const results = [];

  for (const item of items) {
    // Validate item
    if (!item.productId || item.quantity === undefined) {
      throw new Error("Each item must have productId and quantity");
    }

    // Calculate change_qty based on reason
    const change_qty =
      reason === "spoilage" || reason === "waste"
        ? -Math.abs(Number(item.quantity)) // stock-out (negative)
        : Number(item.quantity);            // correction (can be + or -)

    const res = await recordInventoryTransactionAndUpdateInventory({
      productId: item.productId,
      change_qty,
      reason,
      reference: item.reference || null,
      businessId,
      userId,
    });

    results.push(res);
  }

  return results;
}

/**
 * Process Production
 * Deducts ingredients from inventory and adds finished product
 * Expects: { businessId, userId, items: [{ productId, quantity }] }
 */
export async function processProduction(data) {
  const { businessId, userId, items } = data;

  // Validation
  if (!businessId) throw new Error("Missing businessId");
  if (!userId) throw new Error("Missing userId");
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Missing or invalid items array");
  }

  const results = [];

  for (const item of items) {
    const { productId, quantity } = item;

    if (!productId || !quantity || Number(quantity) <= 0) {
      throw new Error("Each item must have productId and positive quantity");
    }

    // Get product details
    const product = await getProductById(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // Only composite/recipe products can be produced
    if (product.product_type === "simple") {
      throw new Error(`Cannot produce simple product: ${product.name}`);
    }

    // Start transaction for this production
    const conn = await startTransaction();

    try {
      // Insert production record
      const productionId = await insertProduction(conn, {
        product_id: productId,
        quantity_produced: Number(quantity),
        user_id: userId
      });

      // Get recipe/ingredients
      let ingredients = [];
      
      if (product.product_type === "recipe") {
        ingredients = await getIngredientsByProduct(productId);
      } else if (product.product_type === "composite") {
        ingredients = await getComboByParent(productId);
      }

      if (!ingredients || ingredients.length === 0) {
        throw new Error(`No recipe/ingredients found for ${product.name}`);
      }

      // Deduct ingredients
      for (const ing of ingredients) {
        const ingredientId = ing.ingredient_product_id || ing.component_product_id;
        const consumptionAmount = ing.consumption_amount || ing.quantity;
        const totalNeeded = Number(consumptionAmount) * Number(quantity);

        // Lock and update ingredient inventory
        const existingInv = await lockInventory(conn, ingredientId);
        
        if (!existingInv) {
          throw new Error(`Ingredient ${ingredientId} not found in inventory`);
        }

        const newQty = Number(existingInv.quantity) - totalNeeded;
        if (newQty < 0) {
          const ingredientProduct = await getProductById(ingredientId);
          throw new Error(
            `Insufficient stock for ingredient "${ingredientProduct?.name}". ` +
            `Required: ${totalNeeded}, Available: ${existingInv.quantity}`
          );
        }

        await updateInventoryQty(conn, ingredientId, -totalNeeded);

        // Record transaction for ingredient deduction
        await insertInventoryTransaction(conn, {
          business_id: businessId,
          product_id: ingredientId,
          change_qty: -totalNeeded,
          reason: "production",
          reference: `production:${productionId}`,
          user_id: userId
        });
      }

      // Add to finished product inventory
      const existingProduct = await lockInventory(conn, productId);
      
      if (existingProduct) {
        await updateInventoryQty(conn, productId, Number(quantity));
      } else {
        await createInventoryRow(conn, productId, Number(quantity));
      }

      // Record transaction for finished product
      await insertInventoryTransaction(conn, {
        business_id: businessId,
        product_id: productId,
        change_qty: Number(quantity),
        reason: "production",
        reference: `production:${productionId}`,
        user_id: userId
      });

      await commitTransaction(conn);

      results.push({
        productionId,
        productId,
        productName: product.name,
        quantityProduced: quantity,
        ingredientsDeducted: ingredients.map(ing => ({
          ingredientId: ing.ingredient_product_id || ing.component_product_id,
          quantityUsed: (ing.consumption_amount || ing.quantity) * Number(quantity)
        }))
      });

    } catch (err) {
      await rollbackTransaction(conn);
      throw err;
    }
  }

  return results;
}

export default {
  addStockIn,
  applyMultiInventoryChange,
  processProduction
};