import pool from '../config/pool.js';


export const findBusinessByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT business_id FROM business_table WHERE owner_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0]; // returns { business_id: ... }
};

export const findRoleByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT system_role_id FROM user_sys_role_table WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0]; // returns { system_role_id: ... }
};


