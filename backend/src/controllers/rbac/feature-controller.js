import pool from '../../config/pool.js'
import {
  getAllModules,
  getAllFeatures,
  getFeaturesGroupedByModule,
} from '../../services/permissionService.js'

/**
 * List all modules
 * GET /api/rbac/modules
 */
export async function listModules(req, res) {
  try {
    const rows = await getAllModules()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Create a new module
 * POST /api/rbac/modules
 */
export async function createModule(req, res) {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    
    const [result] = await pool.query(
      'INSERT INTO module_table (name) VALUES (?)',
      [name]
    )
    res.status(201).json({ module_id: result.insertId, name })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Module with this name already exists' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Update a module
 * PUT /api/rbac/modules/:id
 */
export async function updateModule(req, res) {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    
    const [result] = await pool.query(
      'UPDATE module_table SET name = ? WHERE module_id = ?',
      [name, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Module not found' })
    }
    res.json({ success: true, module_id: Number(id), name })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Module with this name already exists' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Delete a module
 * DELETE /api/rbac/modules/:id
 */
export async function deleteModule(req, res) {
  try {
    const { id } = req.params
    const [result] = await pool.query(
      'DELETE FROM module_table WHERE module_id = ?',
      [id]
    )
    res.json({ success: true, affectedRows: result.affectedRows })
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Module has features assigned to it' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * List all features
 * GET /api/rbac/features
 */
export async function listFeatures(req, res) {
  try {
    const rows = await getAllFeatures()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * List features grouped by module
 * GET /api/rbac/features/grouped
 */
export async function listFeaturesGrouped(req, res) {
  try {
    const grouped = await getFeaturesGroupedByModule()
    res.json(grouped)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Create a new feature
 * POST /api/rbac/features
 */
export async function createFeature(req, res) {
  try {
    const { feature_name, module_id, description } = req.body
    if (!feature_name || !module_id) {
      return res.status(400).json({ error: 'feature_name and module_id are required' })
    }
    
    const [result] = await pool.query(
      'INSERT INTO features_table (feature_name, module_id, description) VALUES (?, ?, ?)',
      [feature_name, module_id, description || '']
    )
    res.status(201).json({ 
      feature_id: result.insertId, 
      feature_name, 
      module_id, 
      description: description || '' 
    })
  } catch (e) {
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Module not found' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Update a feature
 * PUT /api/rbac/features/:id
 */
export async function updateFeature(req, res) {
  try {
    const { id } = req.params
    const { feature_name, module_id, description } = req.body
    
    const updates = []
    const values = []
    
    if (feature_name) {
      updates.push('feature_name = ?')
      values.push(feature_name)
    }
    if (module_id) {
      updates.push('module_id = ?')
      values.push(module_id)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      values.push(description)
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }
    
    values.push(id)
    const [result] = await pool.query(
      `UPDATE features_table SET ${updates.join(', ')} WHERE feature_id = ?`,
      values
    )
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Feature not found' })
    }
    res.json({ success: true, feature_id: Number(id) })
  } catch (e) {
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Module not found' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Delete a feature
 * DELETE /api/rbac/features/:id
 */
export async function deleteFeature(req, res) {
  try {
    const { id } = req.params
    const [result] = await pool.query(
      'DELETE FROM features_table WHERE feature_id = ?',
      [id]
    )
    res.json({ success: true, affectedRows: result.affectedRows })
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Feature has actions assigned to it' })
    }
    res.status(500).json({ error: e.message })
  }
}
