import pool from '../../config/pool.js'

export async function getPositionsByBusiness(businessId) {
  const [rows] = await pool.query(
    'SELECT, bus_user_pos_id, user_id, business_id, bus_pos_id FROM business_user_position WHERE business_id = ? ORDER BY bus_pos_id',
    [businessId]
  )
  return rows
}

export async function insertPosition(businessId, position_name, description) {
  const [result] = await pool.query(
    'INSERT INTO business_position_table (business_id, position_name, description) VALUES (?, ?, ?)',
    [businessId, position_name, description || '']
  )
  return result.insertId
}

export async function deletePositionById(businessId, positionId) {
  const [result] = await pool.query(
    'DELETE FROM business_position_table WHERE position_id = ? AND business_id = ?',
    [positionId, businessId]
  )
  return result.affectedRows
}

export async function getPositionPermissions(positionId, businessId) {
  const sql = `
    SELECT bp.feature_action_id, fa.feature_id, fa.action_id
    FROM business_permission_table bp
    JOIN feature_action_table fa ON fa.feature_action_id = bp.feature_action_id
    WHERE bp.position_id = ? AND bp.business_id = ?
    ORDER BY fa.feature_id, fa.action_id
  `
  const [rows] = await pool.query(sql, [positionId, businessId])
  return rows
}

export async function addPermissionToPosition(businessId, positionId, featureActionId) {
  const [result] = await pool.query(
    'INSERT INTO business_permission_table (business_id, bus_pos_id, feature_action_id) VALUES (?, ?, ?)',
    [businessId, positionId, featureActionId]
  )
  return result.insertId
}

export async function removePermissionFromPosition(businessId, positionId, featureActionId) {
  const [result] = await pool.query(
    'DELETE FROM business_permission_table WHERE business_id = ? AND position_id = ? AND feature_action_id = ?',
    [businessId, positionId, featureActionId]
  )
  return result.affectedRows
}

// Presets (global templates where business_id IS NULL)
export async function listPresets() {
  const [rows] = await pool.query(
    'SELECT position_id, position_name, description FROM business_position_table WHERE business_id IS NULL ORDER BY position_name'
  )
  return rows
}

export async function createPreset(position_name, description) {
  const [result] = await pool.query(
    'INSERT INTO business_position_table (business_id, position_name, description) VALUES (NULL, ?, ?)',
    [position_name, description || '']
  )
  return result.insertId
}

export async function deletePreset(positionId) {
  const [result] = await pool.query(
    'DELETE FROM business_position_table WHERE position_id = ? AND business_id IS NULL',
    [positionId]
  )
  return result.affectedRows
}

export async function getPresetsByIds(presetIds) {
  const [rows] = await pool.query(
    'SELECT position_id, position_name, description FROM business_position_table WHERE business_id IS NULL AND position_id IN (?)',
    [presetIds]
  )
  return rows
}
