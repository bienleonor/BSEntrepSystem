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



export const deleteUser = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM user_table WHERE user_id = ?`, [id]
  );
  return result;
};
