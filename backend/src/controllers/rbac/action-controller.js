import pool from '../../config/pool.js'
import { getAllActions } from '../../services/permissionService.js'

/**
 * List all actions
 * GET /api/rbac/actions
 */
export async function listActions(req, res) {
  try {
    const rows = await getAllActions()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Create a new action
 * POST /api/rbac/actions
 */
export async function createAction(req, res) {
  try {
    const { action_name, description } = req.body
    if (!action_name) {
      return res.status(400).json({ error: 'action_name is required' })
    }
    
    const [result] = await pool.query(
      'INSERT INTO action_table (action_name, description) VALUES (?, ?)',
      [action_name, description || '']
    )
    res.status(201).json({ 
      action_id: result.insertId, 
      action_name, 
      description: description || '' 
    })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Action with this name already exists' })
    }
    res.status(500).json({ error: e.message })
  }
}

/**
 * Update an action
 * PUT /api/rbac/actions/:id
 */
export async function updateAction(req, res) {
  try {
    const { id } = req.params
    const { action_name, description } = req.body
    
    const updates = []
    const values = []
    
    if (action_name) {
      updates.push('action_name = ?')
      values.push(action_name)
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
      `UPDATE action_table SET ${updates.join(', ')} WHERE action_id = ?`,
      values
    )
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Action not found' })
    }
    res.json({ success: true, action_id: Number(id) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

/**
 * Delete an action
 * DELETE /api/rbac/actions/:id
 */
export async function deleteAction(req, res) {
  try {
    const { id } = req.params
    const [result] = await pool.query(
      'DELETE FROM action_table WHERE action_id = ?',
      [id]
    )
    res.json({ success: true, affectedRows: result.affectedRows })
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'Action is in use by feature-action mappings' })
    }
    res.status(500).json({ error: e.message })
  }
}
