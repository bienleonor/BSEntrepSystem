import pool from '../../config/pool.js';

export const updateBusinessInfo = async (business_id, business_name, business_cat_id) => {
  const [result] = await pool.execute(
    `UPDATE business_table SET business_name = ?, business_cat_id = ? WHERE business_id = ?`,
    [business_name, business_cat_id, business_id]
  );
  return result.affectedRows;
};

export const getBusinessSettings = async (business_id) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.business_id, b.business_name, b.business_cat_id, c.name
       FROM business_table b
       LEFT JOIN business_category_table c 
         ON b.business_cat_id = c.business_cat_id
       WHERE b.business_id = ? LIMIT 1`,
      [business_id]
    );

    return rows[0] || null;
  } catch (err) {
    if (err && (err.code === 'ER_NO_SUCH_TABLE' || (err.message && err.message.includes('business_setting_table')))) {
      const [rows] = await pool.execute(
        `SELECT b.business_id, b.business_name, b.business_cat_id, c.name
         FROM business_table b
         LEFT JOIN business_category_table c 
           ON b.business_cat_id = c.business_cat_id
         WHERE b.business_id = ? LIMIT 1`,
        [business_id]
      );
      return rows[0] || null;
    }

    throw err;
  }
};

export const upsertBusinessSetting = async (business_id, logo_blob) => {
  // Check existing
  const [rows] = await pool.execute(
    `SELECT bus_set_id FROM business_setting_table WHERE business_id = ? LIMIT 1`,
    [business_id]
  );

  if (rows.length > 0) {
    const settingId = rows[0].bus_set_id;

    if (logo_blob !== null) {
      // Update only if logo_blob is provided
      const [res] = await pool.execute(
        `UPDATE business_setting_table SET logo = ? WHERE bus_set_id = ?`,
        [logo_blob, settingId]
      );
      return { updated: res.affectedRows };
    }

    // Nothing to update, just return
    return { updated: 0 };
  }

  if (logo_blob !== null) {
    // Insert only if logo_blob is provided
    const [insertRes] = await pool.execute(
      `INSERT INTO business_setting_table (business_id, logo) VALUES (?, ?)`,
      [business_id, logo_blob]
    );
    return { insertedId: insertRes.insertId };
  }

  // No logo provided and no existing row → create a row without logo
  const [insertRes] = await pool.execute(
    `INSERT INTO business_setting_table (business_id) VALUES (?)`,
    [business_id]
  );
  return { insertedId: insertRes.insertId };
};

export const getBusinessLogo = async (business_id) => {
  const [rows] = await pool.execute(
    `SELECT logo FROM business_setting_table WHERE business_id = ? LIMIT 1`,
    [business_id]
  );

  if (!rows.length) return null;
  return rows[0].logo; // raw blob
};