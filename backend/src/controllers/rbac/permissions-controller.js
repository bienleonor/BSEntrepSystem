import pool from '../../config/pool.js'

export async function listPermissions(req, res) {
  try {
    const [rows] = await pool.query('SELECT system_permission_id, permission_name, description FROM system_permissions_table ORDER BY permission_name')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function createPermission(req, res) {
  try {
    const { permission_name, description } = req.body
    if (!permission_name) return res.status(400).json({ error: 'permission_name is required' })
    const [result] = await pool.query(
      'INSERT INTO system_permissions_table (permission_name, description) VALUES (?, ?)',
      [permission_name, description || '']
    )
    res.status(201).json({ system_permission_id: result.insertId, permission_name, description })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function deletePermission(req, res) {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM system_permissions_table WHERE system_permission_id = ?', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
