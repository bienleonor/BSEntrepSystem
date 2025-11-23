import pool from '../config/pool.js';

export const fetchUserDetailsById = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM user_details_table
    WHERE user_id = ?`,
    [user_id]
  );
  
  return rows[0] || null; // return null if not found
};

export const fetchUserDetails = async () =>{
  const [rows] = await pool.execute(
    `SELECT * FROM user_details_table`
  );
  return rows[0] || null;
}


//UserDetails
export const getUserDetails = async (id, data) => {
  // Check if a record already exists for this user_id
  const [existing] = await pool.execute(
    `SELECT COUNT(*) AS count FROM user_details_table WHERE user_id = ?`,
    [id]
  );

  const exists = existing[0].count > 0;

  if (exists) {
      // Update existing record
    const [result] = await pool.execute(
      `UPDATE user_details_table
      SET first_name = ?, middle_name = ?, last_name = ?, contact_no = ?, birthdate = ?, year_id = ?, section_id = ?, group_id = ?
      WHERE user_id = ?`,
      [
        data.first_name,
        data.middle_name,
        data.last_name,
        data.contact_no,
        data.birthdate,
        data.year_id,
        data.section_id,
        data.group_id,
        id
      ]
    );

    return result;
  } else {
      // Insert new record
    const [result] = await pool.execute(
      `INSERT INTO user_details_table 
      (user_id, first_name, middle_name, last_name, contact_no, birthdate, year_id, section_id, group_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.first_name,
        data.middle_name,
        data.last_name,
        data.contact_no,
        data.birthdate,
        data.year_id,
        data.section_id,
        data.group_id,
      ]
    );

    return result;
  }
};