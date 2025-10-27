import pool from '../config/pool.js';
  

export const getSalesTotal = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT SUM(total_amount) AS total_sales 
     FROM sales_table 
     WHERE business_id = ?`,
    [businessId]
  );
  return rows[0];
};


export default getSalesTotal;
