import pool from '../../config/pool.js'

export async function listFeatures(req, res) {
  try {
    const [rows] = await pool.query('SELECT feature_id, feature_name FROM features_table ORDER BY feature_name')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
