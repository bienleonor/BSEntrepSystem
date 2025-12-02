import pool from '../../config/pool.js'

/**
 * Get all positions (roles) available in the system
 * business_position_table stores global position templates
 */
export async function getAllPositions() {
  const [rows] = await pool.query(
    'SELECT business_pos_id, role_name FROM business_position_table ORDER BY role_name'
  )
  return rows
}

/**
 * Get positions assigned to users within a specific business
 */
export async function getPositionsByBusiness(businessId) {
  const sql = `
    SELECT DISTINCT bp.business_pos_id, bp.role_name
    FROM business_position_table bp
    JOIN business_user_position_table bup ON bup.bus_pos_id = bp.business_pos_id
    WHERE bup.business_id = ?
    ORDER BY bp.role_name
  `
  const [rows] = await pool.query(sql, [businessId])
  return rows
}

/**
 * Get all users with their positions in a specific business
 */
export async function getUserPositionsByBusiness(businessId) {
  const sql = `
    SELECT bup.bus_user_pos_id, bup.user_id, bup.business_id, bup.bus_pos_id,
           bp.role_name, bup.date_joined, bup.updated_at
    FROM business_user_position_table bup
    LEFT JOIN business_position_table bp ON bp.business_pos_id = bup.bus_pos_id
    WHERE bup.business_id = ?
    ORDER BY bp.role_name
  `
  const [rows] = await pool.query(sql, [businessId])
  return rows
}

/**
 * Create a new position (role) in business_position_table
 */
export async function insertPosition(roleName) {
  const [result] = await pool.query(
    'INSERT INTO business_position_table (role_name) VALUES (?)',
    [roleName]
  )
  return result.insertId
}

/**
 * Delete a position by ID
 */
export async function deletePositionById(positionId) {
  const [result] = await pool.query(
    'DELETE FROM business_position_table WHERE business_pos_id = ?',
    [positionId]
  )
  return result.affectedRows
}

/**
 * Update position name
 */
export async function updatePosition(positionId, roleName) {
  const [result] = await pool.query(
    'UPDATE business_position_table SET role_name = ? WHERE business_pos_id = ?',
    [roleName, positionId]
  )
  return result.affectedRows
}

/**
 * Get permissions assigned to a position
 * Returns feature:action combinations
 */
export async function getPositionPermissions(positionId) {
  const sql = `
    SELECT bp.bus_permission_id, bp.feature_action_id, 
           fa.feature_id, fa.action_id,
           f.feature_name, a.action_name,
           CONCAT(f.feature_name, ':', a.action_name) AS permission_key
    FROM business_permission_table bp
    JOIN feature_action_table fa ON fa.feature_action_id = bp.feature_action_id
    JOIN features_table f ON f.feature_id = fa.feature_id
    JOIN action_table a ON a.action_id = fa.action_id
    WHERE bp.bus_pos_id = ?
    ORDER BY f.feature_name, a.action_name
  `
  const [rows] = await pool.query(sql, [positionId])
  return rows
}

/**
 * Add a permission (feature_action) to a position
 */
export async function addPermissionToPosition(positionId, featureActionId) {
  const [result] = await pool.query(
    'INSERT INTO business_permission_table (bus_pos_id, feature_action_id) VALUES (?, ?)',
    [positionId, featureActionId]
  )
  return result.insertId
}

/**
 * Remove a permission from a position
 */
export async function removePermissionFromPosition(positionId, featureActionId) {
  const [result] = await pool.query(
    'DELETE FROM business_permission_table WHERE bus_pos_id = ? AND feature_action_id = ?',
    [positionId, featureActionId]
  )
  return result.affectedRows
}

/**
 * Remove permission by its ID
 */
export async function removePermissionById(busPermissionId) {
  const [result] = await pool.query(
    'DELETE FROM business_permission_table WHERE bus_permission_id = ?',
    [busPermissionId]
  )
  return result.affectedRows
}

/**
 * Assign a user to a position within a business
 */
export async function assignUserToPosition(userId, businessId, positionId, updatedBy = null) {
  const [result] = await pool.query(
    `INSERT INTO business_user_position_table (user_id, business_id, bus_pos_id, updated_by) 
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE bus_pos_id = VALUES(bus_pos_id), updated_by = VALUES(updated_by)`,
    [userId, businessId, positionId, updatedBy]
  )
  return result.insertId || result.affectedRows
}

/**
 * Remove a user's position assignment in a business
 */
export async function removeUserFromPosition(userId, businessId) {
  const [result] = await pool.query(
    'DELETE FROM business_user_position_table WHERE user_id = ? AND business_id = ?',
    [userId, businessId]
  )
  return result.affectedRows
}

/**
 * Get a user's position in a specific business
 */
export async function getUserPositionInBusiness(userId, businessId) {
  const sql = `
    SELECT bup.bus_user_pos_id, bup.bus_pos_id, bp.role_name, bup.date_joined
    FROM business_user_position_table bup
    LEFT JOIN business_position_table bp ON bp.business_pos_id = bup.bus_pos_id
    WHERE bup.user_id = ? AND bup.business_id = ?
  `
  const [[row]] = await pool.query(sql, [userId, businessId])
  return row || null
}

/**
 * Get position by ID
 */
export async function getPositionById(positionId) {
  const [[row]] = await pool.query(
    'SELECT business_pos_id, role_name FROM business_position_table WHERE business_pos_id = ?',
    [positionId]
  )
  return row || null
}
