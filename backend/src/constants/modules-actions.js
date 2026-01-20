export const MODULES = Object.freeze({
  BUSINESS_MANAGEMENT: 1,
  INVENTORY: 2,
  MENU_PRODUCTS: 3,
  SALES: 4,
  SYSTEM: 5,
});

export const ACTIONS = Object.freeze({
  CREATE: 1,
  READ: 2,
  UPDATE: 3,
  DELETE: 4,
  CANCEL: 5,
  ARCHIVE: 6,
  EXPORT: 7,
});

// Convenience helper to build a log payload skeleton
export const buildLogBase = ({ business_id, user_id, module_id, action_id, table_name, record_id }) => ({
  business_id,
  user_id,
  module_id,
  action_id,
  table_name,
  record_id,
});