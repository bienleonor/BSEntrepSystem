import pool from '../../config/pool.js'


export const findBusinessByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT b.business_id, b.business_name, b.business_cat_id
     FROM business_table b
     INNER JOIN business_user_position_table bu
       ON b.business_id = bu.business_id
     WHERE bu.user_id = ?`,
    [user_id]
  );

  return rows; // returns array of businesses the user is part of
};


export const findRoleByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT system_role_id FROM user_sys_role_table WHERE user_id = ? LIMIT 1`,
    [user_id]
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





