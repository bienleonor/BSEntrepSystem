import pool from '../config/pool.js';

// Get year by ID - FIXED to use pool.execute
export const getYear = async (year_id) => {
  const [rows] = await pool.execute(
    `SELECT school_year FROM year_table WHERE year_id = ?`,
    [year_id]
  );
  return rows[0] || null;
};

// Get section by ID - FIXED to use pool.execute
export const getSection = async (sec_id) => {
  const [rows] = await pool.execute(
    `SELECT sec_name FROM section_table WHERE sec_id = ?`,
    [sec_id]
  );
  return rows[0] || null;
};

// Get group by user ID
export const getGroup = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT group_id FROM user_details_table WHERE user_id = ?`,
    [user_id]
  );
  if (!rows.length) return null;
  return rows[0].group_id;
};

// Insert access code
export const insertAccessCode = async (business_id, code, year_created) => {
  try {
    const query = `INSERT INTO access_codes_table (business_id, code, year_created, is_active) VALUES (?, ?, ?, 1)`;
    const [result] = await pool.execute(query, [business_id, code, year_created]);
    return result.insertId;
  } catch (err) {
    console.error("insertAccessCode error:", err);
    throw err;
  }
};

// Find access code for validation
export const findCode = async (code) => {
  const [rows] = await pool.execute(
    `SELECT * FROM access_codes_table WHERE code = ? AND is_active = 1`,
    [code]
  );
  return rows[0] || null;
};

// Add employee to business
export const addEmployeeToBusiness = async (user_id, business_id) => {
  const [result] = await pool.execute(
    `INSERT INTO business_user_position_table 
       (user_id, business_id, bus_pos_id)
     VALUES (?, ?, 9)`,
    [user_id, business_id]
  );
  return result.insertId;
};