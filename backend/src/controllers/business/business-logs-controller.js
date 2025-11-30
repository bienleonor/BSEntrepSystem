import { fetchBusinessLogs } from '../../services/business-logs-service.js';
import controllerLogger from '../../utils/controller-logger.js';

const log = controllerLogger('business-logs-controller');

export const getBusinessLogsController = async (req, res) => {
  log.enter('getBusinessLogsController');
  try {
    const business_id = Number(req.params.business_id);
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);

    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }

    const rows = await fetchBusinessLogs({ business_id, limit, offset });
    log.success('getBusinessLogsController', { count: rows.length });
    return res.json({ data: rows, limit, offset });
  } catch (error) {
    log.error?.('getBusinessLogsController', error);
    return res.status(500).json({ message: 'Failed to fetch business logs' });
  }
};
