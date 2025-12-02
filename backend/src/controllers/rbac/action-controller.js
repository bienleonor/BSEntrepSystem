import pool from '../../config/pool.js'

export async function listActions(req, res) {
  try {
    const [rows] = await pool.query('SELECT action_id, action_name FROM action_table ORDER BY action_name')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
