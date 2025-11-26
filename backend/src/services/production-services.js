// services/inventory/production-service.js
import {
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  insertProduction,
  getInventoryRowForUpdate,
  updateInventoryQty,
  insertInventoryRow,
  insertInventoryTransaction
} from "../models/inventory/production-model.js";

export const recordProduction = async ({ product_id, quantity, business_id, user_id }) => {
  const conn = await startTransaction();

  try {
    // 1. Insert production
    const productionId = await insertProduction(conn, {
      product_id,
      quantity_produced: quantity,
      user_id,
    });

    // 2. Update inventory (LOCK rows)
    const existing = await getInventoryRowForUpdate(conn, product_id);

    if (existing) {
      await updateInventoryQty(conn, product_id, quantity);
    } else {
      await insertInventoryRow(conn, product_id, quantity);
    }

    // 3. Add inventory transaction
    await insertInventoryTransaction(conn, {
      business_id,
      product_id,
      change_qty: quantity,
      reason: "production",
      reference: `production:${productionId}`,
      user_id
    });

    await commitTransaction(conn);

    return { productionId, added: quantity };
  } catch (err) {
    await rollbackTransaction(conn);
    throw err;
  }
};
