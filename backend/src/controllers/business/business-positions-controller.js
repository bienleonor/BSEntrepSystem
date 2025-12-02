import { findBusinessByUserId } from '../../models/business/business-model.js'
import {
  getAllPositions,
  getPositionsByBusiness,
  getUserPositionsByBusiness,
  insertPosition,
  deletePositionById,
  updatePosition,
  getPositionPermissions,
  addPermissionToPosition,
  removePermissionFromPosition,
  removePermissionById,
  assignUserToPosition,
  removeUserFromPosition,
  getUserPositionInBusiness,
  getPositionById,
} from '../../models/business/business-positions-model.js'

function getBusinessId(req) {
  return (
    req.headers['x-business-id'] ||
    req.params?.businessId ||
    req.query?.businessId ||
    req.body?.businessId ||
    null
  )
}

async function ensureOwnership(req, res, businessId) {
  try {
    const owned = await findBusinessByUserId(req.user.user_id)
    const owns = owned.some(b => String(b.business_id) === String(businessId))
    if (!owns) {
      res.status(403).json({ error: 'Not authorized for this business' })
      return false
    }
    return true
  } catch (e) {
    res.status(500).json({ error: 'Ownership check failed' })
    return false
  }
}

/**
 * List all available positions (global position templates)
 * GET /api/business/positions/all
 */
export async function listAllPositions(req, res) {
  try {
    const rows = await getAllPositions()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * List positions used in a specific business
 * GET /api/business/:businessId/positions
 */
export async function listPositions(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      // Superadmin can list all positions if no business specified
      return listAllPositions(req, res)
    }
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const rows = await getPositionsByBusiness(businessId)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * List all user-position assignments in a business
 * GET /api/business/:businessId/positions/users
 */
export async function listUserPositions(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const rows = await getUserPositionsByBusiness(businessId)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Create a new position (requires superadmin)
 * POST /api/business/positions
 */
export async function createPosition(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can create positions' })
    }

    const { position_name } = req.body
    if (!position_name) return res.status(400).json({ error: 'position_name is required' })

    const positionId = await insertPosition(position_name)
    res.status(201).json({ business_pos_id: positionId, position_name })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Position with this name already exists' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Update a position (requires superadmin)
 * PUT /api/business/positions/:id
 */
export async function editPosition(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can update positions' })
    }

    const { id } = req.params
    const { position_name } = req.body
    if (!position_name) return res.status(400).json({ error: 'position_name is required' })

    const affected = await updatePosition(id, position_name)
    if (affected === 0) {
      return res.status(404).json({ error: 'Position not found' })
    }
    res.json({ success: true, business_pos_id: Number(id), position_name })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Delete a position (requires superadmin)
 * DELETE /api/business/positions/:id
 */
export async function deletePosition(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can delete positions' })
    }

    const { id } = req.params
    const affected = await deletePositionById(id)
    res.json({ success: true, affectedRows: affected })
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Position is in use by users or has permissions assigned' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Get a single position by ID
 * GET /api/business/positions/:id
 */
export async function getPosition(req, res) {
  try {
    const { id } = req.params
    const position = await getPositionById(id)
    if (!position) {
      return res.status(404).json({ error: 'Position not found' })
    }
    res.json(position)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * List permissions for a position
 * GET /api/business/positions/:id/permissions
 */
export async function listPositionPermissions(req, res) {
  try {
    const { id } = req.params
    const rows = await getPositionPermissions(id)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Add a permission to a position (requires superadmin)
 * POST /api/business/positions/:id/permissions
 */
export async function addPositionPermission(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can modify position permissions' })
    }

    const { id } = req.params
    const { feature_action_id } = req.body
    if (!feature_action_id) return res.status(400).json({ error: 'feature_action_id is required' })

    const insertedId = await addPermissionToPosition(id, feature_action_id)
    res.status(201).json({ bus_permission_id: insertedId })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Permission already assigned to position' })
    }
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Position or feature_action not found' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Remove a permission from a position (requires superadmin)
 * DELETE /api/business/positions/:id/permissions/:featureActionId
 */
export async function removePositionPermission(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can modify position permissions' })
    }

    const { id, featureActionId } = req.params
    const affected = await removePermissionFromPosition(id, featureActionId)
    res.json({ success: true, affectedRows: affected })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Assign a user to a position within a business
 * POST /api/business/:businessId/positions/assign
 */
export async function assignPosition(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return

  try {
    const { user_id, position_id } = req.body
    if (!user_id || !position_id) {
      return res.status(400).json({ error: 'user_id and position_id are required' })
    }

    const updatedBy = req.user?.user_id || null
    const result = await assignUserToPosition(user_id, businessId, position_id, updatedBy)
    res.status(201).json({ success: true, affected: result })
  } catch (e) {
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'User, business, or position not found' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Remove a user's position in a business
 * DELETE /api/business/:businessId/positions/assign/:userId
 */
export async function unassignPosition(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return

  try {
    const { userId } = req.params
    const affected = await removeUserFromPosition(userId, businessId)
    res.json({ success: true, affectedRows: affected })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Get a user's position in a specific business
 * GET /api/business/:businessId/positions/user/:userId
 */
export async function getUserPosition(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    return res.status(400).json({ error: 'Missing business id' })
  }
  
  try {
    const { userId } = req.params
    const position = await getUserPositionInBusiness(userId, businessId)
    if (!position) {
      return res.status(404).json({ error: 'User not found in this business' })
    }
    res.json(position)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
