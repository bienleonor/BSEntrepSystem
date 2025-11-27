import pool from "../../config/pool.js";

export async function getUnitById(unitId) {
  const [rows] = await pool.query(
    `SELECT unit_id, name, abbreviation, base_unit, conversion_factor FROM unit_table WHERE unit_id = ?`,
    [unitId]
  );
  return rows[0] || null;
}

// optional bulk fetch
export async function getUnitsByIds(unitIds = []) {
  if (!unitIds.length) return {};
  const [rows] = await pool.query(
    `SELECT unit_id, name, abbreviation, base_unit, conversion_factor FROM unit_table WHERE unit_id IN (?)`,
    [unitIds]
  );
  const map = {};
  for (const r of rows) map[r.unit_id] = r;
  return map;
}
