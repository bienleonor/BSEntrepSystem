// models/inventory/product-model.js
import pool from '../../config/pool.js';

export const getUnits = async () => {
  const [rows] = await pool.execute(`SELECT unit_id, name FROM unit_table`);
  return rows;
};


export const addProduct = async (productData) => {
  const {
    name = null,
    businessId = null,
    unit_id = null,
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
  await pool.execute(
    `INSERT INTO inventory_table (product_id, quantity, updated_at, unit_id) VALUES (?, ?, NOW(), ?)`,
    [productId, 0, unit_id]
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
      `SELECT p.*, COALESCE(i.quantity,0) AS quantity, i.unit_id AS unit_id FROM product_table p LEFT JOIN inventory_table i ON i.product_id = p.product_id WHERE p.product_id = ?`,
        [productId]
    );
    return rows[0];
}

export const updateProduct = async (productId, productData) => {
    const { name, businessId, unit_id, price, picture, category_id } = productData;

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

  if (rows.length > 0) {
    await pool.execute(
      `UPDATE inventory_table SET unit_id = ? WHERE product_id = ?`,
      [unit_id, productId]
    );
  } else {
    await pool.execute(
      `INSERT INTO inventory_table (product_id, quantity, updated_at, unit_id) VALUES (?, ?, NOW(), ?)`,
      [productId, 0, unit_id]
    );
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
       IFNULL(i.quantity,0) AS quantity,
       i.updated_at AS last_restocked
     FROM product_table p
     LEFT JOIN inventory_table i ON p.product_id = i.product_id
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
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const changeQtyRounded = Number(change_qty) || 0;
    // check if inventory exists
    const [rows] = await conn.query("SELECT * FROM inventory_table WHERE product_id = ? FOR UPDATE", [productId]);
    if (rows.length > 0) {
      await conn.query("UPDATE inventory_table SET quantity = quantity + ?, updated_at = NOW() WHERE product_id = ?", [changeQtyRounded, productId]);
    } else {
      await conn.query("INSERT INTO inventory_table (product_id, quantity, updated_at) VALUES (?, ?, NOW())", [productId, changeQtyRounded]);
    }

    // insert transaction
    await conn.query(
      `INSERT INTO inventory_transactions (business_id, product_id, change_qty, reason, reference, user_id,created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [businessId, productId, changeQtyRounded, reason, reference, userId]
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







export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct,getactiveProducts, getInventoryWithProductDetailsByBusiness, addInventoryStock, getActiveInventoryWithProductDetailsByBusiness, updateProductStatus, recordInventoryTransactionAndUpdateInventory };

    