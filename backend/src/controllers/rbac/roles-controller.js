import pool from '../../config/pool.js'

export async function listSystemRoles(req, res) {
  try {
    const [rows] = await pool.query('SELECT system_role_id, role FROM system_role_table ORDER BY role')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function createSystemRole(req, res) {
  try {
    const { role } = req.body
    if (!role) return res.status(400).json({ error: 'role is required' })
    const [result] = await pool.query('INSERT INTO system_role_table (role) VALUES (?)', [role])
    res.status(201).json({ system_role_id: result.insertId, role })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function deleteSystemRole(req, res) {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM system_role_table WHERE system_role_id = ?', [id])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function listPermissionsForRole(req, res) {
  try {
    const { id } = req.params
    const sql = `
      SELECT p.system_permission_id, p.permission_name, p.description
      FROM system_role_permission_table rp
      JOIN system_permissions_table p ON p.system_permission_id = rp.sys_permission_id
      WHERE rp.sys_role_id = ?
      ORDER BY p.permission_name
    `
    const [rows] = await pool.query(sql, [id])
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function addPermissionToRole(req, res) {
  try {
    const { id } = req.params
    const { permission_id } = req.body
    if (!permission_id) return res.status(400).json({ error: 'permission_id is required' })
    const [result] = await pool.query(
      'INSERT INTO system_role_permission_table (sys_role_id, sys_permission_id) VALUES (?, ?)',
      [id, permission_id]
    )
    res.status(201).json({ system_role_permission_id: result.insertId })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function removePermissionFromRole(req, res) {
  try {
    const { id, permissionId } = req.params
    await pool.query(
      'DELETE FROM system_role_permission_table WHERE sys_role_id = ? AND sys_permission_id = ?',
      [id, permissionId]
    )
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
