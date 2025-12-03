import pool from '../config/pool.js'
import {
  getEffectivePermissions,
  getSystemPermissionsByRole,
  getAllSystemPermissions,
  getBusinessPermissionsByUser,
  listAllFeatureActions,
} from '../repositories/permissionRepository.js'

// ============================================
// PERMISSION CACHE (for scalability)
// In production, replace with Redis for distributed caching
// ============================================
const permissionCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(userId, businessId) {
  return `perms:${userId}:${businessId || 'system'}`
}

/**
 * Get cached permissions or compute fresh
 * This is the SCALABLE way to check permissions
 */
export async function getCachedPermissions({ systemRoleName, userId, businessId }) {
  // Superadmin bypasses everything - no cache or DB needed
  if ((systemRoleName || '').toLowerCase() === 'superadmin') {
    return { permissions: ['*'], isSuperAdmin: true }
  }

  const cacheKey = getCacheKey(userId, businessId)
  const cached = permissionCache.get(cacheKey)
  
  if (cached && Date.now() < cached.expiresAt) {
    return { permissions: cached.permissions, isSuperAdmin: false, fromCache: true }
  }

  // Compute fresh permissions (includes overrides automatically)
  const permissions = await getEffectivePermissions({ systemRoleName, userId, businessId })
  
  // Cache result
  permissionCache.set(cacheKey, {
    permissions,
    expiresAt: Date.now() + CACHE_TTL
  })

  return { permissions, isSuperAdmin: false, fromCache: false }
}

/**
 * Invalidate cache when permissions change
 * Call this when:
 * - User's position changes
 * - Position permissions are updated  
 * - Overrides are added/removed/reset
 */
export function invalidateUserPermissionCache(userId, businessId = null) {
  if (businessId) {
    permissionCache.delete(getCacheKey(userId, businessId))
  } else {
    // Invalidate all caches for this user
    for (const key of permissionCache.keys()) {
      if (key.startsWith(`perms:${userId}:`)) {
        permissionCache.delete(key)
      }
    }
  }
}

/**
 * Invalidate cache for all users in a business
 * Call when position preset permissions change
 */
export function invalidateBusinessPermissionCache(businessId) {
  for (const key of permissionCache.keys()) {
    if (key.endsWith(`:${businessId}`)) {
      permissionCache.delete(key)
    }
  }
}

/**
 * Clear entire permission cache
 */
export function clearPermissionCache() {
  permissionCache.clear()
}

/**
 * Get cache stats for monitoring
 */
export function getCacheStats() {
  let validCount = 0
  const now = Date.now()
  for (const [, value] of permissionCache) {
    if (now < value.expiresAt) validCount++
  }
  return {
    totalEntries: permissionCache.size,
    validEntries: validCount,
    ttlMinutes: CACHE_TTL / 60000
  }
}

// ============================================
// PERMISSION CHECK FUNCTIONS
// ============================================

/**
 * Check if a user has a specific permission
 * @param {Object} params - { userId, systemRoleName, businessId, permissionKey }
 * @returns {Promise<boolean>}
 */
export async function hasPermission({ userId, systemRoleName, businessId, permissionKey }) {
  const { permissions, isSuperAdmin } = await getCachedPermissions({ systemRoleName, userId, businessId })
  if (isSuperAdmin) return true
  return permissions.includes(permissionKey)
}

/**
 * Check if a user has any of the specified permissions
 * @param {Object} params - { userId, systemRoleName, businessId, permissionKeys }
 * @returns {Promise<boolean>}
 */
export async function hasAnyPermission({ userId, systemRoleName, businessId, permissionKeys }) {
  const permissions = await getEffectivePermissions({ systemRoleName, userId, businessId })
  return permissionKeys.some(key => permissions.includes(key))
}

/**
 * Check if a user has all of the specified permissions
 * @param {Object} params - { userId, systemRoleName, businessId, permissionKeys }
 * @returns {Promise<boolean>}
 */
export async function hasAllPermissions({ userId, systemRoleName, businessId, permissionKeys }) {
  const permissions = await getEffectivePermissions({ systemRoleName, userId, businessId })
  return permissionKeys.every(key => permissions.includes(key))
}

/**
 * Get all modules from the database
 * @returns {Promise<Array>}
 */
export async function getAllModules() {
  const [rows] = await pool.query('SELECT module_id, name FROM module_table ORDER BY name')
  return rows
}

/**
 * Get all features with their module information
 * @returns {Promise<Array>}
 */
export async function getAllFeatures() {
  const sql = `
    SELECT f.feature_id, f.feature_name, f.description, f.module_id, m.name AS module_name
    FROM features_table f
    JOIN module_table m ON m.module_id = f.module_id
    ORDER BY m.name, f.feature_name
  `
  const [rows] = await pool.query(sql)
  return rows
}

/**
 * Get all actions from the database
 * @returns {Promise<Array>}
 */
export async function getAllActions() {
  const [rows] = await pool.query('SELECT action_id, action_name, description FROM action_table ORDER BY action_name')
  return rows
}

/**
 * Get features grouped by module
 * @returns {Promise<Object>}
 */
export async function getFeaturesGroupedByModule() {
  const features = await getAllFeatures()
  const grouped = {}
  
  for (const feature of features) {
    if (!grouped[feature.module_name]) {
      grouped[feature.module_name] = {
        module_id: feature.module_id,
        module_name: feature.module_name,
        features: []
      }
    }
    grouped[feature.module_name].features.push({
      feature_id: feature.feature_id,
      feature_name: feature.feature_name,
      description: feature.description
    })
  }
  
  return grouped
}

/**
 * Get a complete permission matrix for a position
 * Returns all feature-actions with whether they're assigned to the position
 * @param {number} positionId
 * @returns {Promise<Array>}
 */
export async function getPositionPermissionMatrix(positionId) {
  const sql = `
    SELECT 
      fa.feature_action_id,
      f.feature_id,
      f.feature_name,
      a.action_id,
      a.action_name,
      m.module_id,
      m.name AS module_name,
      CASE WHEN bp.bus_permission_id IS NOT NULL THEN 1 ELSE 0 END AS is_assigned
    FROM feature_action_table fa
    JOIN features_table f ON f.feature_id = fa.feature_id
    JOIN action_table a ON a.action_id = fa.action_id
    JOIN module_table m ON m.module_id = f.module_id
    LEFT JOIN business_permission_table bp 
      ON bp.feature_action_id = fa.feature_action_id 
      AND bp.bus_pos_id = ?
    ORDER BY m.name, f.feature_name, a.action_name
  `
  const [rows] = await pool.query(sql, [positionId])
  return rows
}

/**
 * Get a complete permission matrix for a system role
 * @param {number} systemRoleId
 * @returns {Promise<Array>}
 */
export async function getSystemRolePermissionMatrix(systemRoleId) {
  const sql = `
    SELECT 
      sp.system_permission_id,
      sp.permission_name,
      sp.description,
      CASE WHEN srp.system_role_permission_id IS NOT NULL THEN 1 ELSE 0 END AS is_assigned
    FROM system_permissions_table sp
    LEFT JOIN system_role_permission_table srp 
      ON srp.sys_permission_id = sp.system_permission_id 
      AND srp.sys_role_id = ?
    ORDER BY sp.permission_name
  `
  const [rows] = await pool.query(sql, [systemRoleId])
  return rows
}

/**
 * Bulk assign permissions to a position
 * @param {number} positionId
 * @param {number[]} featureActionIds
 * @returns {Promise<number>} Number of inserted records
 */
export async function bulkAssignPositionPermissions(positionId, featureActionIds) {
  if (!featureActionIds.length) return 0
  
  const values = featureActionIds.map(faId => [positionId, faId])
  const [result] = await pool.query(
    'INSERT IGNORE INTO business_permission_table (bus_pos_id, feature_action_id) VALUES ?',
    [values]
  )
  return result.affectedRows
}

/**
 * Bulk remove permissions from a position
 * @param {number} positionId
 * @param {number[]} featureActionIds
 * @returns {Promise<number>} Number of deleted records
 */
export async function bulkRemovePositionPermissions(positionId, featureActionIds) {
  if (!featureActionIds.length) return 0
  
  const [result] = await pool.query(
    'DELETE FROM business_permission_table WHERE bus_pos_id = ? AND feature_action_id IN (?)',
    [positionId, featureActionIds]
  )
  return result.affectedRows
}

/**
 * Sync position permissions (set exactly these permissions, remove others)
 * @param {number} positionId
 * @param {number[]} featureActionIds
 * @returns {Promise<Object>} { added, removed }
 */
export async function syncPositionPermissions(positionId, featureActionIds) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    
    // Get current permissions
    const [current] = await conn.query(
      'SELECT feature_action_id FROM business_permission_table WHERE bus_pos_id = ?',
      [positionId]
    )
    const currentIds = current.map(r => r.feature_action_id)
    
    // Calculate differences
    const toAdd = featureActionIds.filter(id => !currentIds.includes(id))
    const toRemove = currentIds.filter(id => !featureActionIds.includes(id))
    
    // Add new permissions
    if (toAdd.length) {
      const values = toAdd.map(faId => [positionId, faId])
      await conn.query(
        'INSERT INTO business_permission_table (bus_pos_id, feature_action_id) VALUES ?',
        [values]
      )
    }
    
    // Remove old permissions
    if (toRemove.length) {
      await conn.query(
        'DELETE FROM business_permission_table WHERE bus_pos_id = ? AND feature_action_id IN (?)',
        [positionId, toRemove]
      )
    }
    
    await conn.commit()
    return { added: toAdd.length, removed: toRemove.length }
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

export default {
  // Cache functions (for scalability)
  getCachedPermissions,
  invalidateUserPermissionCache,
  invalidateBusinessPermissionCache,
  clearPermissionCache,
  getCacheStats,
  // Permission check functions
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  // Admin tooling
  getAllModules,
  getAllFeatures,
  getAllActions,
  getFeaturesGroupedByModule,
  getPositionPermissionMatrix,
  getSystemRolePermissionMatrix,
  bulkAssignPositionPermissions,
  bulkRemovePositionPermissions,
  syncPositionPermissions,
  // Re-export from repository
  getEffectivePermissions,
  getSystemPermissionsByRole,
  getAllSystemPermissions,
  getBusinessPermissionsByUser,
  listAllFeatureActions,
}