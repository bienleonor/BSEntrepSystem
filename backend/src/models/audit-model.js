import pool from '../config/pool.js';
import { ACTIONS } from '../constants/modules-actions.js';

// Legacy simple audit log (kept for backward compatibility if still used elsewhere)
export const createAuditLog = async (businessId, userId, transactionType, referenceId, details) => {
  const query = `
    INSERT INTO audit_logs (business_id, user_id, transaction_type, reference_id, details, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const values = [businessId, userId, transactionType, referenceId, details];
  await pool.query(query, values);
};


export const insertAuditBusinessLog = async (log) => {

  const requiredBase = ['user_id','module_id','action_id'];
  for (const f of requiredBase) {
    if (log[f] === undefined || log[f] === null) {
      throw new Error(`Missing required audit log field: ${f}`);
    }
  }

  const deletingBusiness =
    (log?.table_name === 'business_table') && (log?.action_id === ACTIONS.DELETE);
  if (!deletingBusiness) {
    if (log['business_id'] === undefined || log['business_id'] === null) {
      throw new Error(`Missing required audit log field: business_id`);
    }
  }

  const {
    business_id,
    user_id,
    module_id,
    action_id,
    table_name = '',
    record_id = 0,
    old_data = '{}',
    new_data = '{}',
    ip_address = '',
    user_agent = '',
  } = log;

  const query = `
    INSERT INTO audit_logs (
      business_id, user_id, module_id, action_id,
      table_name, record_id, old_data, new_data,
      ip_address, user_agent, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  // Coerce nullish values to satisfy NOT NULL columns
  const tableNameSafe = table_name ?? '';
  const recordIdSafe = record_id ?? 0;

  const params = [
    business_id,
    user_id,
    module_id,
    action_id,
    tableNameSafe,
    recordIdSafe,
    old_data,
    new_data,
    ip_address,
    user_agent,
  ];

  const [result] = await pool.query(query, params);
  return result.insertId;
};

// Fetch unified audit logs with pagination (client can sort/search further)
export const getUnifiedAuditLogs = async ({ limit = 200, offset = 0 }) => {
  const query = `
    SELECT 
      al.log_id,
      al.business_id,
      al.user_id,
      u.username AS username,
      al.module_id,
      al.action_id,
      al.table_name,
      al.record_id,
      al.old_data,
      al.new_data,
      al.ip_address,
      al.user_agent,
      al.created_at
    FROM audit_logs al
    LEFT JOIN user_table u ON u.user_id = al.user_id
    ORDER BY al.log_id DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(query, [Number(limit), Number(offset)]);
  return rows;
};

// Check for a similar audit row within a time window to avoid duplicates.
export const hasRecentSimilarAudit = async ({
  business_id,
  user_id,
  module_id,
  action_id,
  table_name,
  record_id,
  since, // JavaScript Date object
}) => {
  const q = `
    SELECT log_id
    FROM audit_logs
    WHERE business_id = ?
      AND user_id = ?
      AND module_id = ?
      AND action_id = ?
      AND table_name = ?
      AND record_id = ?
      AND created_at >= ?
    ORDER BY log_id DESC
    LIMIT 1
  `;
  const params = [
    business_id,
    user_id,
    module_id,
    action_id,
    table_name ?? '',
    record_id ?? 0,
    since,
  ];
  const [rows] = await pool.query(q, params);
  return rows.length > 0;
};

// Legacy fetch (original fields) retained if still needed.
export const getAuditLogs = async () => {
  const query = `
    SELECT
        al.log_id,
        b.business_name,
        u.username,
        al.transaction_type,
        al.reference_id,
        al.details,
        al.created_at
    FROM
        audit_logs al
    LEFT JOIN
        business_table b ON al.business_id = b.business_id
    LEFT JOIN
        user_table u ON al.user_id = u.user_id
    ORDER BY
        al.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};