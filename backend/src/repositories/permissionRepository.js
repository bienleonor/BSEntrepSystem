import pool from '../config/pool.js'

// System permissions granted to a system role (e.g., 'admin', 'superadmin')
export async function getSystemPermissionsByRole(systemRoleName) {
	const sql = `
		SELECT p.permission_name AS perm
		FROM system_permissions_table p
		JOIN system_role_permission_table rp ON rp.sys_permission_id = p.system_permission_id
		JOIN system_role_table r ON r.system_role_id = rp.sys_role_id
		WHERE r.role = ?
	`
	const [rows] = await pool.query(sql, [systemRoleName])
	return rows.map(r => r.perm)
}

// All system permissions (useful for superadmin short-circuit)
export async function getAllSystemPermissions() {
	const sql = 'SELECT permission_name AS perm FROM system_permissions_table'
	const [rows] = await pool.query(sql)
	return rows.map(r => r.perm)
}

// Business/position permissions for a user within a specific business
// Returns keys like "feature:action" (e.g., "inventory:edit")
export async function getBusinessPermissionsByUser(userId, businessId) {
	const sql = `
		SELECT DISTINCT CONCAT(f.feature_name, ':', a.action_name) AS perm
		FROM business_user_position_table up
		JOIN business_permission_table bp       ON bp.bus_pos_id = up.bus_pos_id
		JOIN feature_action_table fa            ON fa.feature_action_id = bp.feature_action_id
		JOIN features_table f                   ON f.feature_id = fa.feature_id
		JOIN action_table a                     ON a.action_id = fa.action_id
		WHERE up.user_id = ?
			AND up.business_id = ?
	`
	const [rows] = await pool.query(sql, [userId, businessId])
	return rows.map(r => r.perm)
}

// Compute effective permissions = system perms (by systemRoleName) ∪ business perms (by userId+businessId)
// If systemRoleName is 'superadmin', returns all system permissions and skips business lookup by default
export async function getEffectivePermissions({ systemRoleName, userId, businessId }) {
	const isSuperAdmin = (systemRoleName || '').toLowerCase() === 'superadmin'

	const [systemPerms, businessPerms] = await Promise.all([
		isSuperAdmin ? getAllSystemPermissions() : getSystemPermissionsByRole(systemRoleName),
		businessId ? getBusinessPermissionsByUser(userId, businessId) : Promise.resolve([])
	])

	// Union + de-dup
	const union = new Set([...(systemPerms || []), ...(businessPerms || [])])
	return Array.from(union)
}

// Optional helper: fetch feature:action list for admin tooling
export async function listAllFeatureActions() {
	const sql = `
		SELECT fa.feature_action_id,
					 f.feature_name,
					 a.action_name,
					 CONCAT(f.feature_name, ':', a.action_name) AS key_name
		FROM feature_action_table fa
		JOIN features_table f ON f.feature_id = fa.feature_id
		JOIN action_table a   ON a.action_id = fa.action_id
		ORDER BY f.feature_name, a.action_name
	`
	const [rows] = await pool.query(sql)
	return rows
}

export default {
	getSystemPermissionsByRole,
	getAllSystemPermissions,
	getBusinessPermissionsByUser,
	getEffectivePermissions,
	listAllFeatureActions,
}

