import {
	getEmployeesByBusinessModel,
	addEmployeeModel,
	updateEmployeePositionModel,
	removeEmployeeModel,
} from "../../models/business/business-employee-model.js";

// Get employees for a business
export const getEmployeesByBusiness = async (req, res) => {
	try {
		const business_id = req.params.business_id || req.query.business_id;

		if (!business_id) {
			return res.status(400).json({ success: false, message: "business_id is required" });
		}

		const employees = await getEmployeesByBusinessModel(business_id);
		res.status(200).json({ success: true, data: employees });
	} catch (error) {
		console.error("Error fetching employees:", error);
		res.status(500).json({ success: false, message: "Server error while fetching employees" });
	}
};

// Add employee to a business
export const addEmployee = async (req, res) => {
	try {
		const { user_id, business_id, bus_pos_id = null } = req.body;

		if (!user_id || !business_id) {
			return res.status(400).json({ success: false, message: "user_id and business_id are required" });
		}

		const added = await addEmployeeModel(user_id, business_id, bus_pos_id);
		res.status(201).json({ success: true, data: added, message: "Employee added to business" });
	} catch (error) {
		console.error("Error adding employee:", error);
		res.status(500).json({ success: false, message: "Server error while adding employee" });
	}
};

// Assign/update position for an employee
export const assignPosition = async (req, res) => {
	try {
		const { user_id, business_id, bus_pos_id } = req.body;

		if (!user_id || !business_id || typeof bus_pos_id === "undefined") {
			return res.status(400).json({ success: false, message: "user_id, business_id and bus_pos_id are required" });
		}

		const result = await updateEmployeePositionModel(user_id, business_id, bus_pos_id);
		res.status(200).json({ success: true, data: result, message: "Position updated" });
	} catch (error) {
		console.error("Error updating position:", error);
		res.status(500).json({ success: false, message: "Server error while updating position" });
	}
};

// Remove employee from business
export const removeEmployee = async (req, res) => {
	try {
		const { user_id, business_id } = req.body;

		if (!user_id || !business_id) {
			return res.status(400).json({ success: false, message: "user_id and business_id are required" });
		}

		// Prevent removing self
		if (String(req.user?.user_id) === String(user_id)) {
			return res.status(400).json({ success: false, message: "You cannot remove yourself from the business." });
		}

		const result = await removeEmployeeModel(user_id, business_id);
		res.status(200).json({ success: true, data: result, message: "Employee removed" });
	} catch (error) {
		console.error("Error removing employee:", error);
		res.status(500).json({ success: false, message: "Server error while removing employee" });
	}
};

