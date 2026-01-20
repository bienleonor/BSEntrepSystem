import pool from '../../config/pool.js'
import { listAllFeatureActions } from '../../repositories/permissionRepository.js'

export async function listFeatureActions(req, res) {
  try {
    const rows = await listAllFeatureActions()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function createFeatureAction(req, res) {
  try {
    const { feature_id, action_id } = req.body
    if (!feature_id || !action_id) {
      return res.status(400).json({ error: 'feature_id and action_id are required' })
    }

    // Optional existence checks to provide clearer errors
    const [[feature]] = await pool.query('SELECT feature_id FROM features_table WHERE feature_id = ?', [feature_id])
    if (!feature) return res.status(404).json({ error: 'Feature not found' })
    const [[action]] = await pool.query('SELECT action_id FROM action_table WHERE action_id = ?', [action_id])
    if (!action) return res.status(404).json({ error: 'Action not found' })

    try {
      const [result] = await pool.query(
        'INSERT INTO feature_action_table (feature_id, action_id) VALUES (?, ?)',
        [feature_id, action_id]
      )
      return res.status(201).json({ feature_action_id: result.insertId, feature_id, action_id })
    } catch (e) {
      // Duplicate mapping safeguard
      if (e.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Feature/Action mapping already exists' })
      }
      throw e
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function deleteFeatureAction(req, res) {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: 'feature_action_id is required' })

    // Attempt delete; if constrained by FK, return 409 for clarity
    try {
      const [result] = await pool.query('DELETE FROM feature_action_table WHERE feature_action_id = ?', [id])
      return res.json({ success: true, affectedRows: result.affectedRows })
    } catch (e) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'Mapping is in use by business permissions' })
      }
      throw e
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
