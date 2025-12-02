// models/inventory/product-model.js
import pool from '../../config/pool.js';
import { recordTransactionWithDetails } from './inventory-model.js';

export const getUnits = async () => {
  const [rows] = await pool.execute(`SELECT unit_id, name FROM unit_table`);
  return rows;
};


export const addProduct = async (productData) => {
  const {
    name = null,
    businessId = null,
    unit_id = null,
    unit_multiplier = undefined,
    price = null,
    picture = null,
    product_type = null,
    localpath = null,
    category_id = null,
  } = productData;

  // ✅ Insert product
  const [productResult] = await pool.execute(
    `INSERT INTO product_table (name, business_id, price, picture, product_type, localpath, category_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, businessId, price, picture, product_type, localpath, category_id]
  );

  const productId = productResult.insertId;

  // ✅ Insert data for quantity managemment of product
  // Determine whether the selected unit is a pack. If so, require unit_multiplier from caller.
  let finalUnitMultiplier = 1;
  if (unit_id) {
    const [uRows] = await pool.execute(
      `SELECT name, abbreviation, base_unit FROM unit_table WHERE unit_id = ?`,
      [unit_id]
    );
    const u = uRows[0];
    const isPack = !!u && (
      (u.name || '').toString().toLowerCase().includes('pack') ||
      (u.abbreviation || '').toString().toLowerCase() === 'pack' ||
      (u.base_unit || '').toString().toLowerCase() === 'pack'
    );

    if (isPack) {
      // pack → multiplier must be provided and > 0
      if (unit_multiplier == null || Number(unit_multiplier) <= 0) {
        const err = new Error('PACK_MULTIPLIER_REQUIRED');
        throw err;
      }
      finalUnitMultiplier = Number(unit_multiplier);
    } else {
      finalUnitMultiplier = 1;
    }
  }

  await pool.execute(
    `INSERT INTO inventory_table (product_id, quantity, updated_at, unit_id, unit_multiplier, total_quantity) VALUES (?, ?, NOW(), ?, ?, ?)`,
    [productId, 0, unit_id, finalUnitMultiplier, 0]
  );

  return productResult;
};


export const getAllProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      p.product_id,
      p.name,
      p.business_id,
      i.unit_id,
      p.price,
      -- latest unit cost from product_cost_table
      (
        SELECT pc.cost FROM product_cost_table pc
        WHERE pc.product_id = p.product_id
        ORDER BY pc.valid_from DESC
        LIMIT 1
      ) AS unit_cost,
      p.sku,
      p.category_id,
      c.name AS name,
      p.picture,
      p.product_type,
      p.is_active,
      p.created_at,
      COALESCE(i.quantity,0) AS quantity,
      i.updated_at AS inventory_updated_at
    FROM product_table p
    LEFT JOIN product_category_table c ON c.category_id = p.category_id
    LEFT JOIN inventory_table i ON i.product_id = p.product_id
  `);
  return rows;
};

export const getProductById = async (productId) => {
    const [rows] = await pool.execute(
      `SELECT p.*, COALESCE(i.quantity,0) AS quantity, i.unit_id AS unit_id, i.unit_multiplier AS unit_multiplier FROM product_table p LEFT JOIN inventory_table i ON i.product_id = p.product_id WHERE p.product_id = ?`,
        [productId]
    );
    return rows[0];
}

export const updateProduct = async (productId, productData) => {
  const { name, businessId, unit_id, price, picture, category_id, unit_multiplier } = productData;

  await pool.execute(
    `UPDATE product_table
     SET name = ?, business_id = ?, price = ?, picture = ?, category_id = ?
     WHERE product_id = ?`,
    [name, businessId, price, picture, category_id, productId]
  );

  // ensure inventory row exists and update unit_id
  const [rows] = await pool.execute(
    `SELECT inventory_id FROM inventory_table WHERE product_id = ?`,
    [productId]
  );
  // Determine if the provided unit_id is a pack unit (if supplied)
  let isPack = false;
  if (unit_id) {
    const [uRows] = await pool.execute(
      `SELECT name, abbreviation, base_unit FROM unit_table WHERE unit_id = ?`,
      [unit_id]
    );
    const u = uRows[0];
    isPack = !!u && (
      (u.name || '').toString().toLowerCase().includes('pack') ||
      (u.abbreviation || '').toString().toLowerCase() === 'pack' ||
      (u.base_unit || '').toString().toLowerCase() === 'pack'
    );
  }

  if (rows.length > 0) {
    if (unit_id) {
      if (isPack) {
        // pack → require valid multiplier when explicitly setting pack unit
        if (unit_multiplier == null || Number(unit_multiplier) <= 0) {
          const err = new Error('PACK_MULTIPLIER_REQUIRED');
          throw err;
        }
        await pool.execute(
          `UPDATE inventory_table SET unit_id = ?, unit_multiplier = ? WHERE product_id = ?`,
          [unit_id, Number(unit_multiplier), productId]
        );
      } else {
        // non-pack → force multiplier to 1
        await pool.execute(
          `UPDATE inventory_table SET unit_id = ?, unit_multiplier = 1 WHERE product_id = ?`,
          [unit_id, productId]
        );
      }
    }
    // if unit_id not provided, leave inventory row untouched
  } else {
    // create inventory row
    if (unit_id) {
      if (isPack) {
        if (unit_multiplier == null || Number(unit_multiplier) <= 0) {
          const err = new Error('PACK_MULTIPLIER_REQUIRED');
          throw err;
        }
        await pool.execute(
          `INSERT INTO inventory_table (product_id, quantity, updated_at, unit_id, unit_multiplier) VALUES (?, ?, NOW(), ?, ?)`,
          [productId, 0, unit_id, Number(unit_multiplier)]
        );
      } else {
        await pool.execute(
          `INSERT INTO inventory_table (product_id, quantity, updated_at, unit_id, unit_multiplier) VALUES (?, ?, NOW(), ?, ?)`,
          [productId, 0, unit_id, 1]
        );
      }
    } else {
      // no unit provided → insert basic row
      await pool.execute(
        `INSERT INTO inventory_table (product_id, quantity, updated_at) VALUES (?, ?, NOW())`,
        [productId, 0]
      );
    }
  }
};

export const deleteProduct = async (productId) => {
  // Start a transaction to keep things consistent
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete dependent rows in inventory_table first
    await connection.execute(
      `DELETE FROM inventory_table WHERE product_id = ?`,
      [productId]
    );

    // Delete production records referencing this product (e.g. production batches)
    // This addresses FK fk_prodId_prodtable in production_table
    await connection.execute(
      `DELETE FROM production_table WHERE product_id = ?`,
      [productId]
    );

    // Delete purchase item rows that reference this product (fk_productid_producttbl in purchase_items_table)
    await connection.execute(
      `DELETE FROM purchase_items_table WHERE product_id = ?`,
      [productId]
    );

    // Delete product cost history rows referencing this product (fk_prodid_prodcostbl)
    await connection.execute(
      `DELETE FROM product_cost_table WHERE product_id = ?`,
      [productId]
    );

    // Delete inventory transaction detail rows that reference this product (fk_productId_inventTransactDetailTbl)
    await connection.execute(
      `DELETE FROM inventory_transaction_details WHERE product_id = ?`,
      [productId]
    );

    // Delete dependent rows in recipe/composition tables to satisfy FK constraints
    // Recipes where this product is the parent (final product)
    await connection.execute(
      `DELETE FROM recipe_ingredients_table WHERE product_id = ?`,
      [productId]
    );
    // Recipes where this product is used as an ingredient
    await connection.execute(
      `DELETE FROM recipe_ingredients_table WHERE ingredient_product_id = ?`,
      [productId]
    );

    // Combo items where this product is the parent composite
    await connection.execute(
      `DELETE FROM combo_items_table WHERE parent_product_id = ?`,
      [productId]
    );
    // Combo items where this product is used as a component
    await connection.execute(
      `DELETE FROM combo_items_table WHERE component_product_id = ?`,
      [productId]
    );

    // Now delete the product itself
    const [result] = await connection.execute(
      `DELETE FROM product_table WHERE product_id = ?`,
      [productId]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getProductsByBusiness = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT 
       p.*, 
       c.name AS category_name,
       COALESCE(i.quantity, 0) AS quantity,
       i.updated_at AS inventory_updated_at,
       i.unit_id AS unit_id,
       (
         SELECT pc.cost FROM product_cost_table pc
         WHERE pc.product_id = p.product_id
         ORDER BY pc.valid_from DESC
         LIMIT 1
       ) AS unit_cost
     FROM product_table p
     LEFT JOIN product_category_table c ON c.category_id = p.category_id 
     LEFT JOIN inventory_table i ON i.product_id = p.product_id
     WHERE p.business_id = ?`,
    [businessId]
  );
    return rows;
}

export const updateProductStatus = async (productId, isActive) => {
  const [result] = await pool.execute(
    `UPDATE product_table SET is_active = ? WHERE product_id = ?`,
    [isActive, productId]
  );
  return result;
};

//every active products in product table to inventory table
export const getactiveProducts = async () => {
  const [rows] = await pool.execute(
    `SELECT * FROM product_table WHERE is_active = 1`
  );
  return rows;
}

//fetch products with inventory details
export const getInventoryWithProductDetailsByBusiness = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT 
       p.product_id,
       p.name,
       p.business_id,
       i.unit_id,
       p.price,
       p.picture,
       -- Derive displayed product-level quantity from total_quantity when present
       CASE
         WHEN i.total_quantity IS NOT NULL THEN FLOOR(i.total_quantity / (COALESCE(i.unit_multiplier,1) * COALESCE(u.conversion_factor,1)))
         ELSE COALESCE(i.quantity, 0)
       END AS quantity,
       IFNULL(i.total_quantity,0) AS total_quantity,
       i.updated_at AS last_restocked
     FROM product_table p
     LEFT JOIN inventory_table i ON p.product_id = i.product_id
     LEFT JOIN unit_table u ON i.unit_id = u.unit_id
     WHERE p.business_id = ?`,
    [businessId]
  );
  return rows;
};


export const getActiveInventoryWithProductDetailsByBusiness = async (businessId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         p.product_id, 
         p.name, 
         p.business_id, 
         i.unit_id, 
         p.price, 
         p.picture, 
         CASE
           WHEN i.total_quantity IS NOT NULL THEN FLOOR(i.total_quantity / (COALESCE(i.unit_multiplier,1) * COALESCE(u.conversion_factor,1)))
           ELSE COALESCE(i.quantity, 0)
         END AS quantity,
         i.total_quantity, 
         i.updated_at AS last_restocked
       FROM product_table p
       LEFT JOIN inventory_table i ON p.product_id = i.product_id
       LEFT JOIN unit_table u ON i.unit_id = u.unit_id
       WHERE p.is_active = 0 AND p.business_id = ?`,
      [businessId]
    );
    
    return rows;
  } catch (err) {
    console.error("🔥 SQL error:", err.message);
    throw err;
  }
};

//add stock to inventory table
export const addInventoryStock = async ({ productId, quantity }) => {
  // First check if a row exists for this product_id
  const [rows] = await pool.execute(
    `SELECT inventory_id FROM inventory_table WHERE product_id = ?`,
    [productId]
  );

  let result;

  if (rows.length > 0) {
    // Row exists → increment quantity instead of replacing
    [result] = await pool.execute(
      `UPDATE inventory_table 
       SET quantity = quantity + ?, updated_at = NOW() 
       WHERE product_id = ?`,
      [quantity, productId]
    );
  } else {
    // Row does not exist → insert new
    [result] = await pool.execute(
      `INSERT INTO inventory_table (product_id, quantity, updated_at)
       VALUES (?, ?, NOW())`,
      [productId, quantity]
    );
  }

  return result;
};



//wrong
export const updateinventoryStock = async (productId, quantity) => {
  const [result] = await pool.execute(
    `UPDATE inventory_table SET quantity = ?, updated_at = NOW() WHERE inventory_id = ?`,
    [quantity, productId]
  );
  return result;
}

// Record a stock adjustment (stock out / in) and update inventory quantity accordingly
export async function recordInventoryTransactionAndUpdateInventory({ productId, change_qty, reason, reference, businessId, userId, }) {
  // New implementation: resolve unit_id for the product then delegate to recordTransactionWithDetails
  const qty = Number(change_qty) || 0;

  // Try to get unit_id from inventory_table
  const [invRows] = await pool.execute(`SELECT unit_id, unit_multiplier FROM inventory_table WHERE product_id = ?`, [productId]);
  let unitId = invRows[0]?.unit_id ?? null;
  const unitMultiplier = invRows[0]?.unit_multiplier ?? 1;

  // If still missing, fall back to product default unit
  if (!unitId) {
    const [pRows] = await pool.execute(`SELECT unit_id FROM product_table WHERE product_id = ?`, [productId]);
    unitId = pRows[0]?.unit_id ?? null;
  }

  if (!unitId) {
    throw new Error(`Missing unit_id for product ${productId}. Set a default unit for this product before recording inventory transactions.`);
  }

  const { transactionId } = await recordTransactionWithDetails({
    businessId,
    userId,
    transactionType: reason,
    reference,
    details: [
      { productId, qtyChange: qty, unitId, unitCost: 0, totalCost: 0, unitMultiplier }
    ]
  });

  return { transactionId, productId, change_qty };
}







export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct,getactiveProducts, getInventoryWithProductDetailsByBusiness, addInventoryStock, getActiveInventoryWithProductDetailsByBusiness, updateProductStatus, recordInventoryTransactionAndUpdateInventory };

    