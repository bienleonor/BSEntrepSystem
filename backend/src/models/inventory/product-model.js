// services/unitService.js
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
  } = productData;

  const [result] = await pool.execute(
    `INSERT INTO product_table (name, business_id, unit_id, price, picture, product_type, localpath) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, businessId, unit_id, price, picture, product_type, localpath]
  );

  return result;
};


export const getAllProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      product_id,
      name,
      business_id,
      unit_id,
      price,
      sku,
      picture,
      product_type,
      is_active,
      created_at
    FROM product_table
  `);
  return rows;
};

export const getProductById = async (productId) => {
    const [rows] = await pool.execute(
      `SELECT * FROM product_table WHERE id = ?`,
        [productId]
    );
    return rows[0];
}

export const updateProduct = async (productId, productData) => {
    const { name, businessId, unit_id, price, picture } = productData;

await pool.execute(
  `UPDATE product_table
   SET name = ?, business_id = ?, unit_id = ?, price = ?, picture = ?
   WHERE id = ?`,
  [name, businessId, unit_id, price, picture, productId]
);
};

export const deleteProduct = async (productId) => {
    const [result] = await pool.execute(
      `DELETE FROM product_table WHERE id = ?`,
        [productId]
    );
    return result;
}

export const getProductsByBusiness = async (businessId) => {
    const [rows] = await pool.execute(
      `SELECT * FROM product_table
         WHERE business_id = ?`,
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

//every products in product table to inventory table
export const getInventoryWithProductDetails = async () => {
  const [rows] = await pool.execute(`
    SELECT
      i.inventory_id,
      i.product_id,
      p.name AS product_name,
      p.business_id,
      p.unit_id,
      p.price,
      p.picture,
      p.product_type,
      i.quantity,
      i.reorder_level
    FROM inventory_table i
    JOIN product_table p ON i.product_id = p.product_id
  `);
  return rows;
}

//add stock to inventory table



export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct,getInventoryWithProductDetails };

    