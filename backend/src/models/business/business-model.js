import pool from '../../config/pool.js'


export const findBusinessByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT business_id, business_name FROM business_table WHERE owner_id = ?`,
    [userId]
  );
  return rows; // returns array of businesses
};


export const findRoleByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT system_role_id FROM user_sys_role_table WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0]; // returns { system_role_id: ... }
};


//attention
//get business category from 
export const GetBusinessCategories = async () => {
  const [rows] = await pool.execute(
    `SELECT business_cat_id, name FROM business_category_table ORDER BY name ASC`
  );
  return rows;
};


export const BusinessRegister = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO business_table (business_name, business_cat_id, owner_id) VALUES (?, ?, ?)`,
    [data.business_name, data.business_cat_id, data.owner_id]
  );
  return result.insertId;
};





