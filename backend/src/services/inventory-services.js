import { recordInventoryTransactionAndUpdateInventory } from "../models/inventory/product-model.js";
import { createStockIn, insertStockInItems } from "../models/inventory/stockin-model.js";

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
 * Generic inventory adjustment (stock-out, correction, production)
 */
export async function applyMultiInventoryChange({
  items,
  reason,
  businessId,
  userId,
}) {
  const results = [];

  for (const item of items) {
    const change_qty =
      reason === "spoilage" || reason === "waste"
        ? -Math.abs(item.quantity) // stock-out
        : item.quantity;           // add, correction, production

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
