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

  // ✅ Insert product
  const [productResult] = await pool.execute(
    `INSERT INTO product_table (name, business_id, unit_id, price, picture, product_type, localpath) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, businessId, unit_id, price, picture, product_type, localpath]
  );

  const productId = productResult.insertId;

  // ✅ Insert empty inventory row
  await pool.execute(
    `INSERT INTO inventory_table (product_id, quantity, updated_at) VALUES (?, ?, NOW())`,
    [productId, 0]
  );

  return productResult;
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
      `SELECT * FROM product_table WHERE product_id = ?`,
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

//every active products in product table to inventory table
export const getactiveProducts = async () => {
  const [rows] = await pool.execute(
    `SELECT * FROM product_table WHERE is_active = 1`
  );
  return rows;
}
//fetch products with inventory details
export const getActiveInventoryWithProductDetails = async () => {
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
     WHERE p.is_active = 1`
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
    console.log("📦 DB query result:", rows);
    return rows;
  } catch (err) {
    console.error("🔥 SQL error:", err.message);
    throw err;
  }
};







//add stock to inventory table
export const addInventoryStock = async (inventoryData) => {
  const { productId, quantity } = inventoryData;
  const [result] = await pool.execute(
    `INSERT INTO inventory_table (product_id, quantity, updated_at) 
     VALUES (?, ?, now())`,
    [productId, quantity,]
  );
  return result;
}





export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct,getactiveProducts, getActiveInventoryWithProductDetails, addInventoryStock, getActiveInventoryWithProductDetailsByBusiness, updateProductStatus, };

    