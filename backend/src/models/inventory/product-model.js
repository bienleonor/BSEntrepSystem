// models/inventory/product-model.js
import pool from '../../config/pool.js';

export const getUnits = async () => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM unit_table ORDER BY name`);
    return rows;
  } catch (err) {
    console.error("getUnits error:", err);
    throw err;
  }
};

export const addProduct = async (productData) => {
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
};

export const getAllProducts = async () => {
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
};



export const getProductById = async (productId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM product_table WHERE product_id = ?`,
      [productId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("getProductById error:", err);
    throw err;
  }
};

export const updateProduct = async (productId, productData) => {
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
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM product_table WHERE business_id = ?`,
      [businessId]
    );
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
};


export const getActiveInventoryWithProductDetailsByBusiness = async (businessId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         p.product_id, 
         p.name, 
         p.business_id, 
         p.unit_id, 
         p.price, 
         p.picture, 
         i.quantity, 
         i.updated_at AS last_restocked
       FROM product_table p
       LEFT JOIN inventory_table i ON p.product_id = i.product_id
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

    await conn.commit();
    conn.release();
    return { productId, change_qty };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}







export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct, getactiveProducts, getInventoryWithProductDetailsByBusiness, addInventoryStock, getActiveInventoryWithProductDetailsByBusiness, updateProductStatus, recordInventoryTransactionAndUpdateInventory, updateInventoryStockByProduct };
    