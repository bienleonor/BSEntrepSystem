import pool from "../../config/pool.js";

// Get all employees for a business
export const getEmployeesByBusinessModel = async (business_id) => {
	try {
		const [rows] = await pool.execute(
			`SELECT bup.user_id, bup.business_id, bup.bus_pos_id,
							u.username,
							ud.first_name, ud.last_name, ud.contact_no,
							bp.position_name
			 FROM business_user_position_table bup
			 LEFT JOIN user_table u ON bup.user_id = u.user_id
			 LEFT JOIN user_details_table ud ON u.user_id = ud.user_id
			 LEFT JOIN business_position_table bp ON bp.business_pos_id = bup.bus_pos_id
			 WHERE bup.business_id = ?`,
			[business_id]
		);

		return rows;
	} catch (error) {
		throw error;
	}
};

// Add an employee to a business
export const addEmployeeModel = async (user_id, business_id, bus_pos_id = null) => {
	try {
		const [result] = await pool.execute(
			`INSERT INTO business_user_position_table (user_id, business_id, bus_pos_id) VALUES (?, ?, ?)`,
			[user_id, business_id, bus_pos_id]
		);
		return { insertId: result.insertId };
	} catch (error) {
		throw error;
	}
};

// Update employee position
export const updateEmployeePositionModel = async (user_id, business_id, bus_pos_id) => {
	try {
		const [result] = await pool.execute(
			`UPDATE business_user_position_table SET bus_pos_id = ? WHERE user_id = ? AND business_id = ?`,
			[bus_pos_id, user_id, business_id]
		);
		return result;
	} catch (error) {
		throw error;
	}
};

// Remove employee from business
export const removeEmployeeModel = async (user_id, business_id) => {
	try {
		const [result] = await pool.execute(
			`DELETE FROM business_user_position_table WHERE user_id = ? AND business_id = ?`,
			[user_id, business_id]
		);
		return result;
	} catch (error) {
		throw error;
	}
};
