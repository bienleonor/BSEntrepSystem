import { fetchUnifiedAuditLogs } from '../services/audit-logs-service.js';
import controllerLogger from '../utils/controller-logger.js';

const log = controllerLogger('audit-logs-controller');

export const getUnifiedAuditLogsController = async (req, res) => {
  log.enter('getUnifiedAuditLogsController');
  try {
    const limit = Number(req.query.limit ?? 200);
    const offset = Number(req.query.offset ?? 0);
    const rows = await fetchUnifiedAuditLogs({ limit, offset });
    log.success('getUnifiedAuditLogsController', { count: rows.length });
    return res.json({ data: rows, limit, offset });
  } catch (error) {
    log.error?.('getUnifiedAuditLogsController', error);
    return res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};

export default {
  getUnifiedAuditLogsController,
};