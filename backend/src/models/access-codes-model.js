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
export const getGroup = async (group_id) => {
  const [rows] = await pool.execute(
    `SELECT group_name FROM group_table WHERE group_id = ?`,
    [group_id]
  );
  return rows[0] || null;
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

// Find access code for validation
export const findAccessCodeByBusiness = async (businessId) => {
  const [rows] = await pool.execute(
    `SELECT code 
     FROM access_codes_table 
     WHERE business_id = ? AND is_active = 1
     LIMIT 1`,
    [businessId]
  );
  return rows[0] || null;
};

/**
 * Check if a business already exists with the same section and group combination
 * Access code pattern: YYYY-{section}{group} e.g. 2425-3AG1
 * This prevents multiple businesses from being created under the same access code
 * @param {number} section_id 
 * @param {number} group_id 
 * @returns {object|null} - Returns existing business info or null if none exists
 */
export const findBusinessBySectionAndGroup = async (section_id, group_id) => {
  const [rows] = await pool.execute(
    `SELECT ac.business_id, b.business_name, ac.code
     FROM access_codes_table ac
     INNER JOIN business_table b ON b.business_id = ac.business_id
     WHERE ac.code LIKE CONCAT('____-', 
       (SELECT sec_name FROM section_table WHERE sec_id = ?),
       (SELECT UPPER(REPLACE(REPLACE(group_name, ' ', ''), '-', '')) FROM group_table WHERE group_id = ?))
     AND ac.is_active = 1
     LIMIT 1`,
    [section_id, group_id]
  );
  return rows[0] || null;
};

/**
 * Alternative: Check by parsing existing codes for section+group match
 * More reliable approach using user_details to find conflicts
 */
export const findExistingBusinessByUserGroup = async (section_id, group_id) => {
  const [rows] = await pool.execute(
    `SELECT DISTINCT b.business_id, b.business_name, ac.code
     FROM business_table b
     INNER JOIN access_codes_table ac ON ac.business_id = b.business_id AND ac.is_active = 1
     INNER JOIN business_user_position_table bup ON bup.business_id = b.business_id
     INNER JOIN user_details_table ud ON ud.user_id = bup.user_id
     WHERE ud.section_id = ? AND ud.group_id = ?
     AND bup.bus_pos_id = 1
     LIMIT 1`,
    [section_id, group_id]
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