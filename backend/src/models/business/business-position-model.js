// models/positionModel.js
import pool from "../../config/pool.js";

export const getAllPositionsModel = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM business_position_table");
    return rows;
  } catch (error) {
    throw error;
  }
};

export const addPositionModel = async (role_name = null) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO business_position_table (role_name) VALUES (?)",
      [role_name]
    );
    // Return the inserted row id
    return { business_pos_id: result.insertId, role_name };
  } catch (error) {
    throw error;
  }
};