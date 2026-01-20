// middleware/audit-request-middleware.js
// Generic request-level audit helper attaching a lightweight API to req.audit.
// Controllers or services call req.audit.commit({ ... }) once they know record details.
// Falls back to automatic logging for mutating HTTP verbs when commit() was not invoked.

import { MODULES, ACTIONS } from '../constants/modules-actions.js';
import { logAuditBusinessAction } from '../services/audit-logs-service.js';

const METHOD_ACTION_MAP = {
	POST: ACTIONS.CREATE,
	PUT: ACTIONS.UPDATE,
	PATCH: ACTIONS.UPDATE,
	DELETE: ACTIONS.DELETE,
	GET: ACTIONS.READ,
};

// Heuristic module mapping based on the URL path prefix.
// Adjust / extend as your route structure evolves.
const resolveModuleId = (path = '') => {
	if (/\/business(\/|$)/i.test(path)) return MODULES.BUSINESS_MANAGEMENT;
	if (/\/inventory(\/|$)/i.test(path)) return MODULES.INVENTORY;
	if (/\/menu|\/product|\/products|\/items/i.test(path)) return MODULES.MENU_PRODUCTS;
	if (/\/sales(\/|$)/i.test(path)) return MODULES.SALES;
	return MODULES.SYSTEM; // default fallback
};

// Decide whether to auto-log read operations (GET) without explicit commit.
const shouldAuditReads = () => process.env.AUDIT_READS === '1' || process.env.AUDIT_READS === 'true';

// Utility to shallow-clone plain objects safely for logging (avoid circular refs).
const safeSnapshot = (data) => {
	if (data === null || data === undefined) return null;
	if (Array.isArray(data)) return data.slice(0, 50); // cap large arrays
	if (typeof data === 'object') {
		const out = {};
		const keys = Object.keys(data).slice(0, 50);
		for (const k of keys) {
			const v = data[k];
			if (v === null) out[k] = null; else if (['string','number','boolean'].includes(typeof v)) out[k] = v; else out[k] = '[object]';
		}
		return out;
	}
	return data;
};

export const auditRequestMiddleware = () => {
	return (req, res, next) => {
		const startTime = Date.now();
		const method = (req.method || 'GET').toUpperCase();
		const action_id = METHOD_ACTION_MAP[method] || ACTIONS.READ;
		const module_id = resolveModuleId(req.path || req.originalUrl || '');
		const user_id = req.user?.user_id || req.user?.id || null;
		const business_id = req.businessId || req.body?.business_id || req.body?.businessId || null;

		// Internal state holder, can be mutated by controllers before response finishes.
		const state = {
			committed: false,
			module_id,
			action_id,
			table_name: null,
			record_id: null,
			old_data: null,
			new_data: null,
		};

		// Expose helper to controller code.
		req.audit = {
			// Set core fields (table_name, record_id, action override optionally)
			setTarget: ({ table_name, record_id, action_id: overrideAction, module_id: overrideModule }) => {
				if (table_name) state.table_name = table_name;
				if (record_id !== undefined) state.record_id = record_id;
				if (overrideAction) state.action_id = overrideAction;
				if (overrideModule) state.module_id = overrideModule;
			},
			// Provide snapshots of data before & after mutation
			setData: ({ old_data, new_data }) => {
				if (old_data !== undefined) state.old_data = safeSnapshot(old_data);
				if (new_data !== undefined) state.new_data = safeSnapshot(new_data);
			},
			// Final explicit commit (preferred for accuracy)
			commit: async (extra = {}) => {
				if (state.committed) return; // idempotent
				state.committed = true;
				const payload = {
					business_id: extra.business_id || business_id,
					user_id: extra.user_id || user_id,
					module_id: extra.module_id || state.module_id,
						action_id: extra.action_id || state.action_id,
					table_name: extra.table_name || state.table_name || deriveTableName(req),
					record_id: extra.record_id ?? state.record_id ?? null,
					old_data: extra.old_data !== undefined ? extra.old_data : state.old_data,
					new_data: extra.new_data !== undefined ? extra.new_data : state.new_data,
					req,
				};
				// Basic required field guard (model also enforces)
				if (!payload.business_id || !payload.user_id || !payload.module_id || !payload.action_id) {
					return; // skip incomplete context
				}
				try { await logAuditBusinessAction(payload); } catch {/* swallow */}
			},
		};

		// Derive a table name from route pattern (heuristic)
		function deriveTableName(rq) {
			const path = rq.path || rq.originalUrl || '';
			// e.g., /api/users/123 -> users_table
			const firstSegment = path.split('?')[0].split('/').filter(Boolean)[0];
			if (!firstSegment) return null;
			return firstSegment.replace(/-/g, '_') + '_table';
		}

		// Auto-commit after response finishes if conditions met.
		res.on('finish', async () => {
			if (state.committed) return; // controller already committed
			const status = res.statusCode;
			// Only log successful mutations or successful reads if enabled.
			const isSuccess = status < 400;
			const isMutating = [ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE].includes(state.action_id);
			const isRead = state.action_id === ACTIONS.READ;
			if (!isSuccess) return;
			if (!isMutating && !(isRead && shouldAuditReads())) return;
			// Provide minimal new_data for creation/update/delete when not explicitly set.
			if (!state.new_data && isMutating) {
				state.new_data = safeSnapshot(req.body);
			}
			await req.audit.commit();
		});

		next();
	};
};

export default auditRequestMiddleware;
