import pool from '../config/pool.js';

// Used for registration (password should be hashed before calling this)
export const createUser = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_table 
      (username, email, password,created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [
      data.username,
      data.email,
      data.password, // already hashed
    
    ]
  );
  return result.insertId;
};

// Used for login (returns password for comparison)
export const findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT * FROM user_table WHERE username = ? LIMIT 1`, [username]
  );
  return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await pool.execute(
    `SELECT * FROM user_table`
  );
  return rows;
}

// Used for fetching user profile (does NOT return password)
export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT user_id, username
     FROM user_table WHERE user_id = ? LIMIT 1`, [id]
  );
  return rows[0];
};

//error here potentially
export const updateUser = async (id, data) => {
  const [result] = await pool.execute(
    `UPDATE user_table 
     SET username = ?, email = ?, password = ?, first_name = ?, middle_name = ?, last_name = ?, contact_no = ?, birthdate = ?, updated_at = NOW()
     WHERE user_id = ?`,
    [
      data.username,
      data.email,
      data.password, // should be hashed if changed
      data.first_name,
      data.middle_name,
      data.last_name,
      data.contact_no,
      data.birthdate,
      id
    ]
  );
  return result;
};

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
   SET first_name = ?, middle_name = ?, last_name = ?, contact_no = ?, date = ?, sec_id = ?
   WHERE user_id = ?`,
  [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.contact_no,
    data.birthdate,
    data.section_id, // ✅ now matches sec_id = ?
    id
  ]
);

    return result;
  } else {
    // Insert new record
const [result] = await pool.execute(
  `INSERT INTO user_details_table 
   (user_id, first_name, middle_name, last_name, contact_no, date, sec_id)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    id,
    data.first_name,
    data.middle_name,
    data.last_name,
    data.contact_no,
    data.birthdate,
    data.section_id
  ]
);

    return result;
  }
};


export const deleteUser = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM user_table WHERE user_id = ?`, [id]
  );
  return result;
};



