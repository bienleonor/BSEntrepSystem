import pool from '../../config/pool.js'

/**
 * Get all positions (roles) available in the system
 * business_position_table stores global position templates
 */
export async function getAllPositions() {
  const [rows] = await pool.query(
    'SELECT business_pos_id, position_name FROM business_position_table ORDER BY position_name'
  )
  return rows
}

/**
 * Get positions assigned to users within a specific business
 */
export async function getPositionsByBusiness(businessId) {
  const sql = `
    SELECT DISTINCT bp.business_pos_id, bp.position_name
    FROM business_position_table bp
    JOIN business_user_position_table bup ON bup.bus_pos_id = bp.business_pos_id
    WHERE bup.business_id = ?
    ORDER BY bp.position_name
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
           bp.position_name, bup.date_joined, bup.updated_at
    FROM business_user_position_table bup
    LEFT JOIN business_position_table bp ON bp.business_pos_id = bup.bus_pos_id
    WHERE bup.business_id = ?
    ORDER BY bp.position_name
  `
  const [rows] = await pool.query(sql, [businessId])
  return rows
}

/**
 * Create a new position (role) in business_position_table
 */
export async function insertPosition(positionName) {
  const [result] = await pool.query(
    'INSERT INTO business_position_table (position_name) VALUES (?)',
    [positionName]
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
export async function updatePosition(positionId, positionName) {
  const [result] = await pool.query(
    'UPDATE business_position_table SET position_name = ? WHERE business_pos_id = ?',
    [positionName, positionId]
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
    SELECT bup.bus_user_pos_id, bup.bus_pos_id, bp.position_name, bup.date_joined
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
    'SELECT business_pos_id, position_name FROM business_position_table WHERE business_pos_id = ?',
    [positionId]
  )
  return row || null
}

// ============================================
// PERMISSION OVERRIDES (Per-Business Customization)
// ============================================

/**
 * Check if a business has any overrides for a position
 */
export async function hasOverrides(businessId, positionId) {
  const [[row]] = await pool.query(
    'SELECT COUNT(*) as count FROM business_permission_override_table WHERE business_id = ? AND bus_pos_id = ?',
    [businessId, positionId]
  )
  return row.count > 0
}

/**
 * Get all overrides for a business's position
 */
export async function getOverrides(businessId, positionId) {
  const sql = `
    SELECT o.override_id, o.feature_action_id, o.override_type,
           fa.feature_id, fa.action_id,
           f.feature_name, a.action_name,
           CONCAT(f.feature_name, ':', a.action_name) AS permission_key
    FROM business_permission_override_table o
    JOIN feature_action_table fa ON fa.feature_action_id = o.feature_action_id
    JOIN features_table f ON f.feature_id = fa.feature_id
    JOIN action_table a ON a.action_id = fa.action_id
    WHERE o.business_id = ? AND o.bus_pos_id = ?
    ORDER BY f.feature_name, a.action_name
  `
  const [rows] = await pool.query(sql, [businessId, positionId])
  return rows
}

/**
 * Get effective permissions for a position in a specific business
 * Formula: Preset UNION ADDs EXCEPT REMOVEs
 */
export async function getEffectivePermissions(businessId, positionId) {
  // Get preset permissions
  const presetPermissions = await getPositionPermissions(positionId)
  
  // Get overrides
  const overrides = await getOverrides(businessId, positionId)
  
  const addOverrides = overrides.filter(o => o.override_type === 'ADD')
  const removeOverrides = overrides.filter(o => o.override_type === 'REMOVE')
  
  // Build effective permissions:
  // Start with preset, add ADDs, remove REMOVEs
  const removeSet = new Set(removeOverrides.map(o => o.feature_action_id))
  
  // Filter out removed permissions from preset
  const effectiveFromPreset = presetPermissions.filter(p => !removeSet.has(p.feature_action_id))
  
  // Add the ADD overrides (with isAdded flag for UI)
  const addedPermissions = addOverrides.map(o => ({
    feature_action_id: o.feature_action_id,
    feature_id: o.feature_id,
    action_id: o.action_id,
    feature_name: o.feature_name,
    action_name: o.action_name,
    permission_key: o.permission_key,
    isAdded: true // Flag to show this was added via override
  }))
  
  // Mark removed permissions for UI reference
  const removedPermissionIds = new Set(removeOverrides.map(o => o.feature_action_id))
  
  // Combine: preset (minus removes) + adds
  const effectivePermissions = [
    ...effectiveFromPreset.map(p => ({ ...p, isPreset: true })),
    ...addedPermissions
  ]
  
  return {
    isCustomized: overrides.length > 0,
    permissions: effectivePermissions,
    overrides: {
      added: addOverrides.map(o => o.feature_action_id),
      removed: removeOverrides.map(o => o.feature_action_id)
    },
    presetPermissions // Include original preset for UI comparison
  }
}

/**
 * Add an override (ADD or REMOVE)
 */
export async function addOverride(businessId, positionId, featureActionId, overrideType) {
  // Check if override already exists
  const [[existing]] = await pool.query(
    'SELECT override_id, override_type FROM business_permission_override_table WHERE business_id = ? AND bus_pos_id = ? AND feature_action_id = ?',
    [businessId, positionId, featureActionId]
  )
  
  if (existing) {
    if (existing.override_type === overrideType) {
      return { action: 'none', message: 'Override already exists' }
    }
    // Update existing override type
    await pool.query(
      'UPDATE business_permission_override_table SET override_type = ? WHERE override_id = ?',
      [overrideType, existing.override_id]
    )
    return { action: 'updated', overrideId: existing.override_id }
  }
  
  // Insert new override
  const [result] = await pool.query(
    'INSERT INTO business_permission_override_table (business_id, bus_pos_id, feature_action_id, override_type) VALUES (?, ?, ?, ?)',
    [businessId, positionId, featureActionId, overrideType]
  )
  return { action: 'created', overrideId: result.insertId }
}

/**
 * Remove an override (restore to preset behavior)
 */
export async function removeOverride(businessId, positionId, featureActionId) {
  const [result] = await pool.query(
    'DELETE FROM business_permission_override_table WHERE business_id = ? AND bus_pos_id = ? AND feature_action_id = ?',
    [businessId, positionId, featureActionId]
  )
  return { removed: result.affectedRows > 0 }
}

/**
 * Reset all overrides for a position (restore to preset)
 */
export async function resetOverrides(businessId, positionId) {
  const [result] = await pool.query(
    'DELETE FROM business_permission_override_table WHERE business_id = ? AND bus_pos_id = ?',
    [businessId, positionId]
  )
  return { reset: true, overridesRemoved: result.affectedRows }
}

/**
 * Get list of positions with override status for a business
 */
export async function getPositionsWithOverrideStatus(businessId) {
  const sql = `
    SELECT bp.business_pos_id, bp.position_name,
           COUNT(po.override_id) AS override_count,
           SUM(CASE WHEN po.override_type = 'ADD' THEN 1 ELSE 0 END) AS add_count,
           SUM(CASE WHEN po.override_type = 'REMOVE' THEN 1 ELSE 0 END) AS remove_count
    FROM business_position_table bp
    LEFT JOIN business_permission_override_table po 
      ON po.bus_pos_id = bp.business_pos_id AND po.business_id = ?
    GROUP BY bp.business_pos_id, bp.position_name
    ORDER BY bp.position_name
  `
  const [rows] = await pool.query(sql, [businessId])
  return rows.map(row => ({
    ...row,
    isCustomized: row.override_count > 0
  }))
}

/**
 * Get all available permissions that can be added (not in preset and not already added)
 */
export async function getAvailablePermissionsToAdd(businessId, positionId) {
  const sql = `
    SELECT fa.feature_action_id, fa.feature_id, fa.action_id,
           f.feature_name, a.action_name,
           CONCAT(f.feature_name, ':', a.action_name) AS permission_key
    FROM feature_action_table fa
    JOIN features_table f ON f.feature_id = fa.feature_id
    JOIN action_table a ON a.action_id = fa.action_id
    WHERE fa.feature_action_id NOT IN (
      -- Not in preset
      SELECT feature_action_id FROM business_permission_table WHERE bus_pos_id = ?
    )
    AND fa.feature_action_id NOT IN (
      -- Not already added via override
      SELECT feature_action_id FROM business_permission_override_table 
      WHERE business_id = ? AND bus_pos_id = ? AND override_type = 'ADD'
    )
    ORDER BY f.feature_name, a.action_name
  `
  const [rows] = await pool.query(sql, [positionId, businessId, positionId])
  return rows
}
