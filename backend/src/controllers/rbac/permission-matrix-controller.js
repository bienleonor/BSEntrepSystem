import {
  getPositionPermissionMatrix,
  getSystemRolePermissionMatrix,
  syncPositionPermissions,
  bulkAssignPositionPermissions,
  bulkRemovePositionPermissions,
} from '../../services/permissionService.js'
import pool from '../../config/pool.js'

/**
 * Get permission matrix for a business position
 * Shows all available feature-actions and which ones are assigned
 * GET /api/rbac/positions/:id/matrix
 */
export async function getPositionMatrix(req, res) {
  try {
    const { id } = req.params
    const matrix = await getPositionPermissionMatrix(id)
    
    // Group by module for easier frontend rendering
    const grouped = {}
    for (const row of matrix) {
      if (!grouped[row.module_name]) {
        grouped[row.module_name] = {
          module_id: row.module_id,
          module_name: row.module_name,
          features: {}
        }
      }
      if (!grouped[row.module_name].features[row.feature_name]) {
        grouped[row.module_name].features[row.feature_name] = {
          feature_id: row.feature_id,
          feature_name: row.feature_name,
          actions: []
        }
      }
      grouped[row.module_name].features[row.feature_name].actions.push({
        action_id: row.action_id,
        action_name: row.action_name,
        feature_action_id: row.feature_action_id,
        is_assigned: Boolean(row.is_assigned)
      })
    }
    
    res.json({
      position_id: Number(id),
      matrix: grouped,
      flat: matrix
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Get permission matrix for a system role
 * GET /api/rbac/roles/:id/matrix
 */
export async function getSystemRoleMatrix(req, res) {
  try {
    const { id } = req.params
    const matrix = await getSystemRolePermissionMatrix(id)
    
    res.json({
      system_role_id: Number(id),
      permissions: matrix
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Sync permissions for a position (set exactly these, remove others)
 * PUT /api/rbac/positions/:id/permissions/sync
 * Body: { feature_action_ids: [1, 2, 3, ...] }
 */
export async function syncPositionPermissionsHandler(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can modify position permissions' })
    }

    const { id } = req.params
    const { feature_action_ids } = req.body
    
    if (!Array.isArray(feature_action_ids)) {
      return res.status(400).json({ error: 'feature_action_ids must be an array' })
    }
    
    const result = await syncPositionPermissions(id, feature_action_ids)
    res.json({ 
      success: true, 
      position_id: Number(id),
      added: result.added,
      removed: result.removed
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Bulk add permissions to a position
 * POST /api/rbac/positions/:id/permissions/bulk
 * Body: { feature_action_ids: [1, 2, 3, ...] }
 */
export async function bulkAddPositionPermissions(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can modify position permissions' })
    }

    const { id } = req.params
    const { feature_action_ids } = req.body
    
    if (!Array.isArray(feature_action_ids) || feature_action_ids.length === 0) {
      return res.status(400).json({ error: 'feature_action_ids must be a non-empty array' })
    }
    
    const inserted = await bulkAssignPositionPermissions(id, feature_action_ids)
    res.status(201).json({ 
      success: true, 
      position_id: Number(id),
      inserted
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Bulk remove permissions from a position
 * DELETE /api/rbac/positions/:id/permissions/bulk
 * Body: { feature_action_ids: [1, 2, 3, ...] }
 */
export async function bulkDeletePositionPermissions(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can modify position permissions' })
    }

    const { id } = req.params
    const { feature_action_ids } = req.body
    
    if (!Array.isArray(feature_action_ids) || feature_action_ids.length === 0) {
      return res.status(400).json({ error: 'feature_action_ids must be a non-empty array' })
    }
    
    const deleted = await bulkRemovePositionPermissions(id, feature_action_ids)
    res.json({ 
      success: true, 
      position_id: Number(id),
      deleted
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Sync permissions for a system role
 * PUT /api/rbac/roles/:id/permissions/sync
 * Body: { permission_ids: [1, 2, 3, ...] }
 */
export async function syncSystemRolePermissions(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can modify role permissions' })
    }

    const { id } = req.params
    const { permission_ids } = req.body
    
    if (!Array.isArray(permission_ids)) {
      return res.status(400).json({ error: 'permission_ids must be an array' })
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      
      // Get current permissions
      const [current] = await conn.query(
        'SELECT sys_permission_id FROM system_role_permission_table WHERE sys_role_id = ?',
        [id]
      )
      const currentIds = current.map(r => r.sys_permission_id)
      
      // Calculate differences
      const toAdd = permission_ids.filter(pid => !currentIds.includes(pid))
      const toRemove = currentIds.filter(pid => !permission_ids.includes(pid))
      
      // Add new permissions
      if (toAdd.length) {
        const values = toAdd.map(permId => [id, permId])
        await conn.query(
          'INSERT INTO system_role_permission_table (sys_role_id, sys_permission_id) VALUES ?',
          [values]
        )
      }
      
      // Remove old permissions
      if (toRemove.length) {
        await conn.query(
          'DELETE FROM system_role_permission_table WHERE sys_role_id = ? AND sys_permission_id IN (?)',
          [id, toRemove]
        )
      }
      
      await conn.commit()
      res.json({ 
        success: true, 
        system_role_id: Number(id),
        added: toAdd.length,
        removed: toRemove.length
      })
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
