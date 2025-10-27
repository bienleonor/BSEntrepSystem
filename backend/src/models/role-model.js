import pool from '../config/pool.js';

// 🔍 Get full role info by role name (e.g., 'admin')
export const findRoleByName = async (roleName) => {
  const [rows] = await pool.query(
    'SELECT * FROM system_role_table WHERE role = ?',
    [roleName]
  );
  return rows[0]; // returns { system_role_id, role }
};

// 🔍 Get full role info by role ID
export const findRoleById = async (roleId) => {
  const [rows] = await pool.query(
    'SELECT * FROM system_role_table WHERE system_role_id = ?',
    [roleId]
  );
  return rows[0]; // returns { system_role_id, role }
};

// 🔍 Get system_role_id for a given user
export const findRoleByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT system_role_id FROM user_sys_role_table WHERE user_id = ? LIMIT 1',
    [userId]
  );
  return rows[0]; // returns { system_role_id }
};
