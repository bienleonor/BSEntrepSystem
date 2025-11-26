import { recordInventoryTransactionAndUpdateInventory } from "../models/inventory/product-model.js";

export async function applyInventoryChange({
  productId,
  change_qty,
  reason,
  reference = null,
  businessId,
  userId,
}) {
  return await recordInventoryTransactionAndUpdateInventory({
    productId,
    change_qty,
    reason,
    reference,
    businessId,
    userId,
  });
}
