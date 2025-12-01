import pool from '../../config/pool.js';

// Inserts a business log entry
export const insertBusinessLog = async (log) => {
  const required = ['business_id','user_id','module_id','action_id','table_name','record_id'];
  for (const f of required) {
    if (log[f] === undefined || log[f] === null) {
      throw new Error(`Missing required log field: ${f}`);
    }
  }

  const {
    business_id,
    user_id,
    module_id,
    action_id,
    table_name,
    record_id,
    old_data = '{}',
    new_data = '{}',
    ip_address = '',
    user_agent = '',
  } = log;

  const query = `
    INSERT INTO business_logs (
      business_id, user_id, module_id, action_id,
      table_name, record_id, old_data, new_data,
      ip_address, user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    business_id,
    user_id,
    module_id,
    action_id,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent,
  ];

  const [result] = await pool.query(query, params);
  return result.insertId;
};

// Fetch logs by business with optional filters and pagination
export const getBusinessLogs = async ({ business_id, limit = 50, offset = 0 }) => {
  const query = `
    SELECT 
      bl.business_logs_id,
      bl.business_id,
      bl.user_id,
      u.username AS username,
      bl.module_id,
      bl.action_id,
      bl.table_name,
      bl.record_id,
      bl.old_data,
      bl.new_data,
      bl.ip_address,
      bl.user_agent,
      bl.created_at
    FROM business_logs bl
    LEFT JOIN user_table u ON u.user_id = bl.user_id
    WHERE bl.business_id = ?
    ORDER BY bl.business_logs_id DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(query, [business_id, Number(limit), Number(offset)]);
  return rows;
};

// Distinct dates (YYYY-MM-DD) that have logs for a business
export const getBusinessLogDates = async ({ business_id }) => {
  const query = `
    SELECT DISTINCT DATE(bl.created_at) AS log_date
    FROM business_logs bl
    WHERE bl.business_id = ?
    ORDER BY log_date DESC
  `;
  const [rows] = await pool.query(query, [business_id]);
  return rows.map(r => r.log_date);
};

// Fetch all logs for a given business and date
export const getBusinessLogsByDate = async ({ business_id, date }) => {
  const query = `
    SELECT 
      bl.business_logs_id,
      bl.business_id,
      bl.user_id,
      u.username AS username,
      bl.module_id,
      bl.action_id,
      bl.table_name,
      bl.record_id,
      bl.old_data,
      bl.new_data,
      bl.ip_address,
      bl.user_agent,
      bl.created_at
    FROM business_logs bl
    LEFT JOIN user_table u ON u.user_id = bl.user_id
    WHERE bl.business_id = ? AND DATE(bl.created_at) = ?
    ORDER BY bl.business_logs_id DESC
  `;
  const [rows] = await pool.query(query, [business_id, date]);
  return rows;
};
