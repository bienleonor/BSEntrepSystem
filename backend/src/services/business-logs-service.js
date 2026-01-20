import { insertBusinessLog, getBusinessLogs, getBusinessLogDates, getBusinessLogsByDate } from '../models/business/business-logs-model.js';
import { logAuditBusinessAction } from './audit-logs-service.js';

// Helper to safely stringify data (handles objects and primitives)
const toJson = (data) => {
  if (data === undefined || data === null) return null;
  try {
    return typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    return String(data);
  }
};

// Standardized log action helper
export const logBusinessAction = async ({
  business_id,
  user_id,
  module_id,
  action_id,
  table_name,
  record_id,
  old_data,
  new_data,
  req,
}) => {
  const ip_address = req?.ip || req?.headers['x-forwarded-for'] || '';
  const user_agent = req?.headers?.['user-agent'] || '';

  const id = await insertBusinessLog({
    business_id,
    user_id,
    module_id,
    action_id,
    table_name,
    record_id,
    old_data: toJson(old_data) || '{}',
    new_data: toJson(new_data) || '{}',
    ip_address,
    user_agent,
  });
  // Mirror into audit_logs (non-blocking)
  logAuditBusinessAction({
    business_id,
    user_id,
    module_id,
    action_id,
    table_name,
    record_id,
    old_data,
    new_data,
    req,
  }).catch(() => {});
  return id;
};

export const fetchBusinessLogs = async ({ business_id, limit, offset }) => {
  return getBusinessLogs({ business_id, limit, offset });
};

export const fetchBusinessLogDates = async ({ business_id }) => {
  return getBusinessLogDates({ business_id });
};

export const fetchBusinessLogsCSVByDate = async ({ business_id, date }) => {
  const rows = await getBusinessLogsByDate({ business_id, date });
  // Convert to CSV string
  const headers = ['business_logs_id','business_id','username','module_id','action_id','table_name','record_id','ip_address','user_agent','created_at'];
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g,'""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push([
      r.business_logs_id,
      r.business_id,
      r.username ?? '',
      r.module_id,
      r.action_id,
      r.table_name ?? '',
      r.record_id ?? '',
      r.ip_address ?? '',
      r.user_agent ?? '',
      r.created_at ? new Date(r.created_at).toISOString() : ''
    ].map(escape).join(','));
  }
  return lines.join('\n');
};
