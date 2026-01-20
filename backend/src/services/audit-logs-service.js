import { insertAuditBusinessLog, getUnifiedAuditLogs } from '../models/audit-model.js';
import { ACTIONS } from '../constants/modules-actions.js';

const toJson = (data) => {
  if (data === undefined || data === null) return '{}';
  try {
    return typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    return '{}';
  }
};

export const logAuditBusinessAction = async ({
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
  const ip_address = req?.ip || req?.headers?.['x-forwarded-for'] || '';
  const user_agent = req?.headers?.['user-agent'] || '';
  try {
    // Globally disable READ audits as requested
    if (action_id === ACTIONS.READ) return null;

    return await insertAuditBusinessLog({
      business_id,
      user_id,
      module_id,
      action_id,
      table_name,
      record_id,
      old_data: toJson(old_data),
      new_data: toJson(new_data),
      ip_address,
      user_agent,
    });
  } catch (e) {
    console.error('Failed to insert audit log (unified)', e?.message);
    return null;
  }
};

export const fetchUnifiedAuditLogs = async ({ limit, offset }) => {
  return getUnifiedAuditLogs({ limit, offset });
};

export default {
  logAuditBusinessAction,
  fetchUnifiedAuditLogs,
};