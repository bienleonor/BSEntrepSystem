// models/inventory/product-model.js
import pool from '../../config/pool.js';
import { recordTransactionWithDetails } from './inventory-model.js';

export const getUnits = async () => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM unit_table ORDER BY name`);
    return rows;
  } catch (err) {
    console.error("getUnits error:", err);
    throw err;
  }
};
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER

export const addProduct = async (productData) => {
<<<<<<< HEAD
  try {
    const { name, business_id, unit_id, price, sku, category_id, picture, product_type } = productData;
    const [result] = await pool.execute(
      `INSERT INTO product_table (name, business_id, unit_id, price, sku, category_id, picture, product_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, business_id, unit_id, price, sku, category_id, picture, product_type]
    );
    return result.insertId;
  } catch (err) {
    console.error("addProduct error:", err);
    throw err;
  }
=======
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
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6
};

export const getAllProducts = async () => {
<<<<<<< HEAD
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.product_id,
        p.name,
        p.business_id,
        p.unit_id,
        p.price,
        p.sku,
        p.category_id,
        c.name AS category_name,
        p.picture,
        p.product_type,
        p.is_active,
        p.created_at
      FROM product_table p
      LEFT JOIN product_category_table c ON c.category_id = p.category_id
    `);
    return rows;
  } catch (err) {
    console.error("getAllProducts error:", err);
    throw err;
  }
=======
  const [rows] = await pool.execute(`
    SELECT 
      p.product_id,
      p.name,
      p.business_id,
      i.unit_id,
      p.price,
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
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6
};



export const getProductById = async (productId) => {
  try {
    const [rows] = await pool.execute(
<<<<<<< HEAD
      `SELECT * FROM product_table WHERE product_id = ?`,
      [productId]
=======
      `SELECT p.*, COALESCE(i.quantity,0) AS quantity, i.unit_id AS unit_id, i.unit_multiplier AS unit_multiplier FROM product_table p LEFT JOIN inventory_table i ON i.product_id = p.product_id WHERE p.product_id = ?`,
        [productId]
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6
    );
    return rows[0] || null;
  } catch (err) {
    console.error("getProductById error:", err);
    throw err;
  }
};

export const updateProduct = async (productId, productData) => {
<<<<<<< HEAD
  try {
    const fields = [];
    const params = [];
    Object.entries(productData).forEach(([k,v]) => {
      fields.push(`${k} = ?`);
      params.push(v);
    });
    params.push(productId);
    const [result] = await pool.execute(
      `UPDATE product_table SET ${fields.join(", ")}, updated_at = NOW() WHERE product_id = ?`,
      params
    );
    return result;
  } catch (err) {
    console.error("updateProduct error:", err);
    throw err;
=======
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
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6
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
<<<<<<< HEAD
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM product_table WHERE business_id = ?`,
      [businessId]
    );
=======
  const [rows] = await pool.execute(
    `SELECT 
       p.*, 
       c.name AS category_name,
       COALESCE(i.quantity, 0) AS quantity,
       i.updated_at AS inventory_updated_at,
       i.unit_id AS unit_id
     FROM product_table p
     LEFT JOIN product_category_table c ON c.category_id = p.category_id 
     LEFT JOIN inventory_table i ON i.product_id = p.product_id
     WHERE p.business_id = ?`,
    [businessId]
  );
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6
    return rows;
  } catch (err) {
    console.error("getProductsByBusiness error:", err);
    throw err;
  }
};


export const updateProductStatus = async (productId, isActive) => {
  try {
    const [result] = await pool.execute(
      `UPDATE product_table SET is_active = ?, updated_at = NOW() WHERE product_id = ?`,
      [isActive ? 1 : 0, productId]
    );
    return result;
  } catch (err) {
    console.error("updateProductStatus error:", err);
    throw err;
  }
};

//every active products in product table to inventory table
export const getactiveProducts = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM product_table WHERE is_active = 1`
    );
    return rows;
  } catch (err) {
    console.error("getactiveProducts error:", err);
    throw err;
  }
};

<<<<<<< HEAD
// fetch products with inventory details
export const getInventoryWithProductDetailsByBusiness = async (businessId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         p.product_id,
         p.name,
         p.business_id,
         p.unit_id,
         p.price,
         p.picture,
         IFNULL(i.quantity,0) AS quantity,
         i.updated_at AS last_restocked
       FROM product_table p
       LEFT JOIN inventory_table i ON p.product_id = i.product_id
       WHERE p.business_id = ?`,
      [businessId]
    );
    return rows;
  } catch (err) {
    console.error("getInventoryWithProductDetailsByBusiness error:", err);
    throw err;
  }
=======
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
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6
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
       WHERE p.is_active = 1 AND p.business_id = ?`,
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


export const updateInventoryStockByProduct = async (productId, quantity) => {
  const [result] = await pool.execute(
    `UPDATE inventory_table SET quantity = ?, updated_at = NOW() WHERE product_id = ?`,
    [quantity, productId]
  );
  return result;
};

// Record a stock adjustment (stock out / in) and update inventory quantity accordingly
<<<<<<< HEAD
export async function recordInventoryTransactionAndUpdateInventory({ productId, change_qty, reason, reference, businessId, userId }) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // check if inventory exists
    const [rows] = await conn.query("SELECT * FROM inventory_table WHERE product_id = ? FOR UPDATE", [productId]);
    if (rows.length > 0) {
      await conn.query("UPDATE inventory_table SET quantity = quantity + ?, updated_at = NOW() WHERE product_id = ?", [change_qty, productId]);
    } else {
      await conn.query("INSERT INTO inventory_table (product_id, quantity, updated_at) VALUES (?, ?, NOW())", [productId, change_qty]);
    }

    // insert transaction
    await conn.query(
      `INSERT INTO inventory_transactions (business_id, product_id, change_qty, reason, reference, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [businessId, productId, change_qty, reason, reference, userId]
    );
=======
export async function recordInventoryTransactionAndUpdateInventory({ productId, change_qty, reason, reference, businessId, userId, }) {
  // New implementation: resolve unit_id for the product then delegate to recordTransactionWithDetails
  const qty = Number(change_qty) || 0;

  // Try to get unit_id from inventory_table
  const [invRows] = await pool.execute(`SELECT unit_id, unit_multiplier FROM inventory_table WHERE product_id = ?`, [productId]);
  let unitId = invRows[0]?.unit_id ?? null;
  const unitMultiplier = invRows[0]?.unit_multiplier ?? 1;
>>>>>>> e84ed12d8f37724e869f6f8a30125bb65bd2d0e6

  // If still missing, fall back to product default unit
  if (!unitId) {
    const [pRows] = await pool.execute(`SELECT unit_id FROM product_table WHERE product_id = ?`, [productId]);
    unitId = pRows[0]?.unit_id ?? null;
  }

  if (!unitId) {
    throw new Error(`Missing unit_id for product ${productId}. Set a default unit for this product before recording inventory transactions.`);
  }

  await recordTransactionWithDetails({
    businessId,
    userId,
    transactionType: reason,
    reference,
    details: [
      { productId, qtyChange: qty, unitId, unitCost: 0, totalCost: 0, unitMultiplier }
    ]
  });

  return { productId, change_qty };
}


export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct, getactiveProducts, getInventoryWithProductDetailsByBusiness, addInventoryStock, getActiveInventoryWithProductDetailsByBusiness, updateProductStatus, recordInventoryTransactionAndUpdateInventory, updateInventoryStockByProduct };
    