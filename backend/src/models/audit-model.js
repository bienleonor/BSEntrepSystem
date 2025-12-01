import pool from '../config/pool.js';

// Legacy simple audit log (kept for backward compatibility if still used elsewhere)
export const createAuditLog = async (businessId, userId, transactionType, referenceId, details) => {
  const query = `
    INSERT INTO audit_logs (business_id, user_id, transaction_type, reference_id, details, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const values = [businessId, userId, transactionType, referenceId, details];
  await pool.query(query, values);
};

// New unified structure mirroring business_logs.
// Expects the audit_logs table to have these columns added:
// module_id, action_id, table_name, record_id, old_data, new_data, ip_address, user_agent
export const insertAuditBusinessLog = async (log) => {
  // Allow system-level logs without a business_id (NULL) for actions like register/login
  const required = ['user_id','module_id','action_id','table_name'];
  for (const f of required) {
    if (log[f] === undefined || log[f] === null) {
      throw new Error(`Missing required audit log field: ${f}`);
    }
  }

  const {
    business_id = 0,
    user_id,
    module_id,
    action_id,
    table_name,
    record_id = null,
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

  const params = [
    (business_id == null ? 0 : business_id),
    user_id,
    module_id,
    action_id,
    table_name,
    (record_id == null ? 0 : record_id),
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