import { insertBusinessLog, getBusinessLogs } from '../models/business/business-logs-model.js';

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

  return insertBusinessLog({
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
};

export const fetchBusinessLogs = async ({ business_id, limit, offset }) => {
  return getBusinessLogs({ business_id, limit, offset });
};
