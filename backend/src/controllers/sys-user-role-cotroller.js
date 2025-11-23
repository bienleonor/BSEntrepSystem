import pool from "../config/pool.js";
import { findRoleByName } from "../models/sys-role-model.js"

export const upgradeUserRole = async (req, res) => {
    console.log("Incoming information: ", req.body);
  const { user_id, role } = req.body;

  if (!user_id || !role)
    return res.status(400).json({ error: "user_id and role are required" });

  try {
    // Get system_role_id from role name
    const roleResult = await findRoleByName(role);
    if (!roleResult) {
      return res.status(404).json({ error: "Role not found" });
    }

    const system_role_id = roleResult.system_role_id;

    // Update only (no insert)
    const [result] = await pool.query(
      `
      UPDATE user_sys_role_table
      SET system_role_id = ?
      WHERE user_id = ?
      `,
      [system_role_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User role mapping not found — cannot update"
      });
    }

    return res.json({ message: "User system role updated successfully" });

  } catch (err) {
    console.error("Role upgrade error:", err);
    return res.status(500).json({ error: err.message });
  }
};
