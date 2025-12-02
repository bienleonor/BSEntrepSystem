import { 
  recordInventoryTransactionAndUpdateInventory,
  getProductById
} from "../models/inventory/product-model.js";
import { getIngredientsByProduct } from "../models/inventory/recipe-model.js";
import { getComboByParent } from "../models/inventory/combo-model.js";
import { createStockIn, validateSimpleProducts, insertStockInItems } from "../models/inventory/stockin-model.js";
import { convertAmount } from "../services/unit-service.js"; // ✅ ADD THIS
import { recordTransactionWithDetails } from "../models/inventory/inventory-model.js";
import pool from "../config/pool.js";

/**
 * Stock-in (purchase)
 */
export async function addStockIn({ businessId, userId, items }) {
  if (!businessId) throw new Error("Missing businessId");
  if (!userId) throw new Error("Missing userId");

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price || 0),
    0
  );

  if (isNaN(totalAmount)) {
    throw new Error("Computed totalAmount is NaN — check quantity/unit_price");
  }

  const stockinId = await createStockIn({ businessId, userId, totalAmount });
  // insertStockInItems will record an inventory transaction header + details and update inventory_table
  const { transactionId } = await insertStockInItems(stockinId, items, { businessId, userId });

  return { stockinId, transactionId, totalAmount };
}

/**
 * Generic inventory adjustment (stock-out, correction)
 */
export async function applyMultiInventoryChange({ items, reason, businessId, userId }) {
  const results = [];

  for (const item of items) {
    const change_qty =
      reason === "spoilage" || reason === "waste"
        ? -Math.abs(item.quantity)
        : item.quantity;

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
 * Process production
 * Deducts ingredients from inventory with unit conversion, adds finished product
 */
export async function processProduction({ items, businessId, userId }) {
  if (!businessId) throw new Error("Missing businessId");
  if (!userId) throw new Error("Missing userId");
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Missing or invalid items array");
  }

  const results = [];

  for (const item of items) {
    const { productId, quantity } = item;
    if (!productId || quantity <= 0) throw new Error("Invalid productId or quantity");

    const product = await getProductById(productId);
    if (!product) throw new Error(`Product ${productId} not found`);
    if (product.product_type === "simple") {
      throw new Error(`Cannot produce simple product: ${product.name}`);
    }

    // Build a single transaction (header + details) for this production item
    const details = [];
    // Track total batch cost derived from ingredients/components
    let totalBatchCost = 0;

    // 1️⃣ PROCESS RECIPE PRODUCTS (consume ingredients)
    if (product.product_type === "recipe") {
      const ingredients = await getIngredientsByProduct(productId);

      for (const ing of ingredients) {
        const ingredientProduct = await getProductById(ing.ingredient_product_id);
        if (!ingredientProduct) {
          throw new Error(`Ingredient product ${ing.ingredient_product_id} not found`);
        }

        const rawUsage = (ing.consumption_amount) * quantity;

        const fromUnitId = ing.ingredient_unit_id || ingredientProduct.unit_id;
        const toUnitId = ingredientProduct.unit_id;

        let convertedUsage;
        try {
          convertedUsage = await convertAmount(rawUsage, fromUnitId, toUnitId);
        } catch (err) {
          if (err.message.includes("Incompatible unit dimensions")) {
            throw new Error(
              `Cannot produce ${product.name}: incompatible unit for ingredient ${ingredientProduct.name} (${err.message})`
            );
          } else {
            throw err;
          }
        }

        // Fetch latest unit cost of ingredient (fallback to product.price or 0)
        const [costRowsIng] = await pool.execute(
          `SELECT cost FROM product_cost_table WHERE product_id = ? ORDER BY valid_from DESC LIMIT 1`,
          [ing.ingredient_product_id]
        );
        const ingredientUnitCost = Number(costRowsIng[0]?.cost ?? ingredientProduct.price ?? 0);
        const ingredientTotalCost = ingredientUnitCost * Math.abs(convertedUsage);

        totalBatchCost += ingredientTotalCost;

        details.push({
          productId: ing.ingredient_product_id,
          qtyChange: -Math.abs(convertedUsage),
          unitId: toUnitId,
          unitCost: ingredientUnitCost,
          totalCost: ingredientTotalCost,
        });
      }
    }

    // 2️⃣ PROCESS COMPOSITE PRODUCTS (consume components)
    if (product.product_type === "composite") {
      const combos = await getComboByParent(productId);

      for (const combo of combos) {
        const childProduct = await getProductById(combo.child_product_id);
        if (!childProduct) {
          throw new Error(`Component product ${combo.child_product_id} not found`);
        }

        const rawUsage = combo.quantity * quantity;

        const fromUnitId = combo.unit_id || childProduct.unit_id;
        const toUnitId = childProduct.unit_id;

        let convertedUsage;
        try {
          convertedUsage = await convertAmount(rawUsage, fromUnitId, toUnitId);
        } catch (err) {
          if (err.message.includes("Incompatible unit dimensions")) {
            throw new Error(
              `Cannot produce ${product.name}: incompatible unit for component ${childProduct.name} (${err.message})`
            );
          } else {
            throw err;
          }
        }

        const [costRowsComp] = await pool.execute(
          `SELECT cost FROM product_cost_table WHERE product_id = ? ORDER BY valid_from DESC LIMIT 1`,
          [combo.child_product_id]
        );
        const componentUnitCost = Number(costRowsComp[0]?.cost ?? childProduct.price ?? 0);
        const componentTotalCost = componentUnitCost * Math.abs(convertedUsage);

        totalBatchCost += componentTotalCost;

        details.push({
          productId: combo.child_product_id,
          qtyChange: -Math.abs(convertedUsage),
          unitId: toUnitId,
          unitCost: componentUnitCost,
          totalCost: componentTotalCost,
        });
      }
    }

    // 3️⃣ ADD FINISHED PRODUCT STOCK (produce finished goods)
    const finishedUnitId = product.unit_id;
    // Compute unit cost for finished product from totalBatchCost
    const finishedUnitCost = quantity > 0 ? (totalBatchCost / Number(quantity)) : 0;
    const finishedTotalCost = finishedUnitCost * Number(quantity);

    details.push({
      productId,
      qtyChange: Number(quantity),
      unitId: finishedUnitId,
      unitCost: finishedUnitCost,
      totalCost: finishedTotalCost,
      unitMultiplier: product.unit_multiplier ?? 1,
    });

    // Record one transaction header + many details atomically
    const { transactionId } = await recordTransactionWithDetails({
      businessId,
      userId,
      transactionType: 'production',
      reference: `production:${productId}`,
      details,
    });

    // Insert a production_table row for auditing/history
    await pool.execute(
      `INSERT INTO production_table (product_id, quantity_produced, user_id, created_at) VALUES (?, ?, ?, NOW())`,
      [productId, quantity, userId]
    );

    // Record the derived finished product unit cost into product_cost_table
    if (finishedUnitCost > 0) {
      await pool.execute(
        `INSERT INTO product_cost_table (product_id, cost, valid_from) VALUES (?, ?, NOW())`,
        [productId, finishedUnitCost]
      );
    }

    results.push({ transactionId, productId, productName: product.name, quantityProduced: quantity });
  }

  return results;
}