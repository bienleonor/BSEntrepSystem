import { MODULES, ACTIONS } from '../constants/modules-actions.js';
import { logAuditBusinessAction } from '../services/audit-logs-service.js';

// Basic module inference by URL prefix
const inferModule = (url = '') => {
  if (url.startsWith('/api/business')) return MODULES.BUSINESS_MANAGEMENT;
  if (url.startsWith('/api/inventory')) return MODULES.INVENTORY;
  if (url.startsWith('/api/sales')) return MODULES.SALES;
  if (url.startsWith('/api/users') || url.startsWith('/api/users-details') || url.startsWith('/api/auth')) return MODULES.SYSTEM;
  if (url.startsWith('/api/admin')) return MODULES.SYSTEM;
  return MODULES.SYSTEM;
};

// Table name from path segments (resource name best-effort)
const inferTableName = (url = '') => {
  try {
    const path = url.split('?')[0];
    const parts = path.split('/').filter(Boolean); // remove empty
    // parts: ['api','<module>','<resource>', ...]
    const resource = parts[2] || parts[1] || 'system';
    return String(resource).replace(/-/g, '_');
  } catch {
    return 'system';
  }
};

const inferAction = (req) => {
  const url = req.originalUrl || req.url || '';
  if (/\/export(\b|\?|\/.|$)/i.test(url)) return ACTIONS.EXPORT;
  switch ((req.method || 'GET').toUpperCase()) {
    case 'POST': return ACTIONS.CREATE;
    case 'PUT':
    case 'PATCH': return ACTIONS.UPDATE;
    case 'DELETE': return ACTIONS.DELETE;
    default: return ACTIONS.READ;
  }
};

// Try best-effort to capture a record id
const inferRecordId = (req) => {
  // Prefer explicit params the router set
  const paramValues = req?.params ? Object.values(req.params) : [];
  for (const v of paramValues) {
    if (v === undefined || v === null) continue;
    if (/^\d+$/.test(String(v))) return Number(v);
  }
  // Fallback: last numeric-like segment in path
  const path = (req.originalUrl || req.url || '').split('?')[0];
  const parts = path.split('/').filter(Boolean).reverse();
  for (const seg of parts) {
    if (/^\d+$/.test(seg)) return Number(seg);
  }
  return null;
};

// Skip noisy or self-referential endpoints
const shouldSkip = (req) => {
  const url = req.originalUrl || '';
  // Avoid logging audit log reads/exports themselves
  if (url.startsWith('/api/admin/audit-logs')) return true;
  // Optionally skip pure listing of logs
  if (/\/logs(\/|$)/.test(url) && /\/business\//.test(url)) return false; // keep business logs
  // Skip static
  if (url.startsWith('/uploads/')) return true;
  return false;
};

export const auditRequestMiddleware = (req, res, next) => {
  // Attach after-response hook
  res.on('finish', async () => {
    try {
      if (shouldSkip(req)) return;
      // Only log successful operations
      if (res.statusCode < 200 || res.statusCode >= 400) return;

      const module_id = inferModule(req.originalUrl || req.url || '');
      const action_id = inferAction(req);
      const table_name = inferTableName(req.originalUrl || req.url || '');
      let record_id = inferRecordId(req);

      const businessHeader = req.headers['x-business-id'] || req.headers['x-business-id'.toLowerCase()] || null;
      let business_id = businessHeader ? Number(businessHeader) : (req.user?.business_id ?? null);
      if (business_id == null || Number.isNaN(Number(business_id))) business_id = 0; // system context
      const user_id = req.user?.user_id ?? null;

      // Require user context; business_id may be system-level (0) for some actions
      if (!user_id) return;

      // Enforce record_id presence for mutating actions; for READ/EXPORT allow 0
      const mutating = action_id === ACTIONS.CREATE || action_id === ACTIONS.UPDATE || action_id === ACTIONS.DELETE || action_id === ACTIONS.CANCEL || action_id === ACTIONS.ARCHIVE;
      if (record_id == null && mutating) return; // skip if we can't identify a specific record on write actions
      if (record_id == null) record_id = 0; // non-mutating: use 0 as generic id

      await logAuditBusinessAction({
        business_id,
        user_id,
        module_id,
        action_id,
        table_name,
        record_id,
        // old_data/new_data not available generically at app level
        req,
      });
    } catch (e) {
      // Never block the response due to audit issues
      // eslint-disable-next-line no-console
      console.error('auditRequestMiddleware error:', e?.message);
    }
  });

  next();
};

export default auditRequestMiddleware;
