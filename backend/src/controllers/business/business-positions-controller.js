import { findBusinessByUserId } from '../../models/business/business-model.js'
import {
  getPositionsByBusiness,
  insertPosition,
  deletePositionById,
  getPositionPermissions,
  addPermissionToPosition,
  removePermissionFromPosition,
  listPresets,
  createPreset,
  deletePreset,
  getPresetsByIds,
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

export async function listPositions(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      return res.json([])
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

// Presets are global templates stored in business_position_table with business_id IS NULL
export async function listPositionPresets(req, res) {
  try {
    const rows = await listPresets()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function createPositionPreset(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') return res.status(403).json({ error: 'Only superadmin can create presets' })

    const { position_name, description } = req.body
    if (!position_name) return res.status(400).json({ error: 'position_name is required' })
    const presetId = await createPreset(position_name, description)
    res.status(201).json({ position_id: presetId, position_name, description })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function deletePositionPreset(req, res) {
  try {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role !== 'superadmin') return res.status(403).json({ error: 'Only superadmin can delete presets' })

    const { id } = req.params
    const affected = await deletePreset(id)
    res.json({ success: true, affectedRows: affected })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

// Clone selected presets into a specific business
export async function clonePresetsToBusiness(req, res) {
  const role = (req.user?.system_role || '').toLowerCase()
  if (role !== 'superadmin') return res.status(403).json({ error: 'Only superadmin can clone presets' })

  const businessId = req.headers['x-business-id'] || req.body?.businessId
  if (!businessId) return res.status(400).json({ error: 'Missing business id' })

  const { presetIds } = req.body
  if (!presetIds || !Array.isArray(presetIds) || presetIds.length === 0) {
    return res.status(400).json({ error: 'presetIds array is required' })
  }

  try {
    const presets = await getPresetsByIds(presetIds)
    if (!presets.length) return res.status(404).json({ error: 'No presets found' })

    const inserted = []
    for (const p of presets) {
      const newId = await insertPosition(businessId, p.position_name, p.description)
      inserted.push({ preset_id: p.position_id, new_position_id: newId })
    }

    res.status(201).json({ success: true, inserted })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function createPosition(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      return res.status(400).json({ error: 'Select a business to create positions' })
    }
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const { position_name, description } = req.body
    if (!position_name) return res.status(400).json({ error: 'position_name is required' })
    const positionId = await insertPosition(businessId, position_name, description)
    res.status(201).json({ position_id: positionId, business_id: Number(businessId), position_name, description })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function deletePosition(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      return res.status(400).json({ error: 'Select a business to delete positions' })
    }
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const { id } = req.params
    const affected = await deletePositionById(businessId, id)
    res.json({ success: true, affectedRows: affected })
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Position has assigned users or permissions' })
    }
    res.status(500).json({ error: e.message })
  }
}

export async function listPositionPermissions(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      return res.json([])
    }
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const { id } = req.params
    const rows = await getPositionPermissions(id, businessId)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function addPositionPermission(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      return res.status(400).json({ error: 'Select a business to add permissions' })
    }
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const { id } = req.params
    const { feature_action_id } = req.body
    if (!feature_action_id) return res.status(400).json({ error: 'feature_action_id is required' })

    try {
      const insertedId = await addPermissionToPosition(businessId, id, feature_action_id)
      res.status(201).json({ business_permission_id: insertedId })
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Permission already assigned to position' })
      }
      throw e
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function removePositionPermission(req, res) {
  const businessId = getBusinessId(req)
  if (!businessId) {
    const role = (req.user?.system_role || '').toLowerCase()
    if (role === 'superadmin') {
      return res.status(400).json({ error: 'Select a business to remove permissions' })
    }
    return res.status(400).json({ error: 'Missing business id' })
  }
  if (!(await ensureOwnership(req, res, businessId))) return
  try {
    const { id, featureActionId } = req.params
    const affected = await removePermissionFromPosition(businessId, id, featureActionId)
    res.json({ success: true, affectedRows: affected })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
