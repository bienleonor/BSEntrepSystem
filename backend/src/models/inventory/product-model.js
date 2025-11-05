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
  product_type = null
} = productData;


const [result] = await pool.execute(
  `INSERT INTO product_table (name, business_id, unit_id, price, picture, product_type) 
   VALUES (?, ?, ?, ?, ?, ?)`,
  [name, businessId, unit_id, price, picture, product_type]
);


  return result;
};

//use in inventory.js
export const getAllProducts = async () => {
    const [rows] = await pool.execute(`SELECT * FROM products_table`);
    return rows;
}

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

export default { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct };

    