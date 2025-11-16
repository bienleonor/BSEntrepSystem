import pool from '../config/pool.js';
import getAllProducts from './inventory/product-model.js';




export const createSale = async (saleData) => {
  const { business_id, total_amount, sale_date } = saleData;
  const [result] = await pool.execute(
    `INSERT INTO sales_table (business_id, total_amount, created_at) 
     VALUES (?, ?, ?)`,
    [business_id, total_amount, sale_date]
  );
  return result.insertId;
}




export const getSalesTotal = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT SUM(total_amount) AS total_sales 
     FROM sales_table 
     WHERE business_id = ?`,
    [businessId]
  );
  return rows[0];
};


export default  { createSale, getSalesTotal }; ;
