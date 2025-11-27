import { 
  recordInventoryTransactionAndUpdateInventory,
  getProductById
} from "../models/inventory/product-model.js";
import { getIngredientsByProduct } from "../models/inventory/recipe-model.js";
import { getComboByParent } from "../models/inventory/combo-model.js";

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
  await insertStockInItems(stockinId, items);

  for (const item of items) {
    await recordInventoryTransactionAndUpdateInventory({
      productId: item.productId,
      change_qty: item.quantity,
      reason: "purchase",
      businessId,
      userId,
      reference: `stockin:${stockinId}`,
    });
  }

  return { stockinId, totalAmount };
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

    // 1️⃣ Deduct recipe ingredients
    if (product.product_type === "recipe") {
      const ingredients = await getIngredientsByProduct(productId);
      for (const ing of ingredients) {
        const totalQty = ing.consumption_amount * quantity; // already converted in model
        await recordInventoryTransactionAndUpdateInventory({
          productId: ing.ingredient_product_id,
          change_qty: -totalQty,
          reason: "production",
          reference: `production:${productId}`,
          businessId,
          userId,
        });
      }
    }

    // 2️⃣ Deduct combo ingredients
    if (product.product_type === "composite") {
      const combos = await getComboByParent(productId);
      for (const combo of combos) {
        const totalQty = combo.quantity * quantity;
        await recordInventoryTransactionAndUpdateInventory({
          productId: combo.child_product_id,
          change_qty: -totalQty,
          reason: "production",
          reference: `production:${productId}`,
          businessId,
          userId,
        });
      }
    }

    // 3️⃣ Add finished product to inventory
    await recordInventoryTransactionAndUpdateInventory({
      productId,
      change_qty: quantity,
      reason: "production",
      reference: `production:${productId}`,
      businessId,
      userId,
    });

    results.push({ productId, productName: product.name, quantityProduced: quantity });
  }

  return results;
}
