import pool from '../config/pool.js';

// Generate next group number
export const getLatestGroup = (business_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `
      SELECT code FROM access_code_table
      WHERE business_id = ?
      ORDER BY access_id DESC LIMIT 1
      `,
      [business_id],
      (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) return resolve(1);

        const lastCode = result[0].code; // e.g. 2425-4AGR4
        const match = lastCode.match(/GR(\d+)$/);
        const latestGroup = match ? parseInt(match[1]) : 0;

        resolve(latestGroup + 1);
      }
    );
  });
};

export const insertAccessCode = (business_id, code, year_created) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `
      INSERT INTO access_code_table (business_id, code, year_created, is_active)
      VALUES (?, ?, ?, 1)
      `,
      [business_id, code, year_created],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

export const getSy = (sy_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT school_year FROM sy_table WHERE sy_id = ?`,
      [sy_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

export const getSection = (sec_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT sec_name FROM section_table WHERE sec_id = ?`,
      [sec_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};

export const addEmployeeToBusiness = (user_id, business_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `
      INSERT INTO business_user_position_table 
        (user_id, business_id, bus_pos_id)
      VALUES (?, ?, NULL)
      `,
      [user_id, business_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

export const findCode = (code) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM access_code_table WHERE code = ? AND is_active = 1`,
      [code],
      (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      }
    );
  });
};
