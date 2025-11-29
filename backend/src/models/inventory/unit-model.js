import pool from "../../config/pool.js";

export async function getUnitById(unitId) {
  try {
    const [rows] = await pool.execute(
      `SELECT unit_id, name, abbreviation, base_unit, conversion_factor FROM unit_table WHERE unit_id = ?`,
      [unitId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("getUnitById error:", err);
    throw err;
  }
}

// optional bulk fetch
export async function getUnitsByIds(ids) {
  try {
    if (!ids || !ids.length) return {};

    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await pool.execute(
      `SELECT * FROM unit_table WHERE unit_id IN (${placeholders})`,
      ids
    );

  // Convert array → object for fast lookup
  const map = {};
  rows.forEach(u => {
    map[u.unit_id] = u;
  });
//NO TRY CATCH HERE, HANDLE ERRORS IN CONTROLLER
  return map;
}

//no catch