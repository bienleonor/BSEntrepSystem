import pool from '../../config/pool.js'


export const findBusinessByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT b.business_id, b.business_name, b.business_cat_id,
            bu.bus_pos_id, bp.role_name AS position_name,
            bu.date_joined
     FROM business_table b
     INNER JOIN business_user_position_table bu
       ON b.business_id = bu.business_id
     LEFT JOIN business_position_table bp
       ON bp.business_pos_id = bu.bus_pos_id
     WHERE bu.user_id = ?`,
    [user_id]
  );

  return rows; // returns array of businesses with position info
};


export const findRoleByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT system_role_id FROM user_sys_role_table WHERE user_id = ? LIMIT 1`,
    [user_id]
  );
  return rows[0]; // returns { system_role_id: ... }
};


//attention
//get business category from 
export const GetBusinessCategories = async () => {
  const [rows] = await pool.execute(
    `SELECT business_cat_id, name FROM business_category_table ORDER BY name ASC`
  );
  return rows;
};


export const BusinessRegister = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO business_table (business_name, business_cat_id, owner_id) VALUES (?, ?, ?)`,
    [data.business_name, data.business_cat_id, data.owner_id]
  );
  return result.insertId;
};

export const Getallbusinesses = async (statusFilter = null) => {
  // Build dynamic query to optionally filter by status (1=ACTIVE, 0=OFFLINE)
  let query = `
    SELECT 
      b.business_id, 
      b.business_name, 
      b.business_cat_id, 
      COALESCE(ac.status, 0) AS status,
      u.username AS owner
    FROM business_table b
    INNER JOIN user_table u ON b.owner_id = u.user_id
    LEFT JOIN (
      SELECT business_id, MAX(is_active) AS status
      FROM access_codes_table
      GROUP BY business_id
    ) ac ON ac.business_id = b.business_id
  `;

  const params = [];
  if (statusFilter !== null && statusFilter !== undefined) {
    query += ` WHERE COALESCE(ac.status, 0) = ?`;
    params.push(statusFilter);
  }

  const [rows] = await pool.execute(query, params);
  return rows;
};

export const deleteBusinessById = async (businessId) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Detach audit logs to avoid FK constraint (set business_id to NULL)
    try {
      await conn.execute(
        `UPDATE audit_logs SET business_id = NULL WHERE business_id = ?`,
        [businessId]
      );
    } catch (e) {
      // If DB schema doesn't allow NULLs or FK doesn't support SET NULL, fallback to deleting logs
      await conn.execute(
        `DELETE FROM audit_logs WHERE business_id = ?`,
        [businessId]
      );
    }

    // Delete dependent rows
    await conn.execute(
      `DELETE FROM access_codes_table WHERE business_id = ?`,
      [businessId]
    );

    await conn.execute(
      `DELETE FROM business_user_position_table WHERE business_id = ?`,
      [businessId]
    );

    // Finally delete the business row
    const [result] = await conn.execute(
      `DELETE FROM business_table WHERE business_id = ?`,
      [businessId]
    );

    await conn.commit();
    return result.affectedRows > 0;
  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Error deleting business:', error);
    return false;
  } finally {
    if (conn) await conn.release();
  }
};



