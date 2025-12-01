import { fetchBusinessLogs, fetchBusinessLogDates, fetchBusinessLogsCSVByDate } from '../../services/business-logs-service.js';
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

export const getBusinessLogDatesController = async (req, res) => {
  log.enter('getBusinessLogDatesController');
  try {
    const business_id = Number(req.params.business_id);
    if (!business_id) return res.status(400).json({ message: 'business_id is required' });
    const dates = await fetchBusinessLogDates({ business_id });
    return res.json({ data: dates });
  } catch (error) {
    log.error?.('getBusinessLogDatesController', error);
    return res.status(500).json({ message: 'Failed to fetch available dates' });
  }
};

export const exportBusinessLogsByDateController = async (req, res) => {
  log.enter('exportBusinessLogsByDateController');
  try {
    const business_id = Number(req.params.business_id);
    const date = req.query.date; // YYYY-MM-DD
    if (!business_id) return res.status(400).json({ message: 'business_id is required' });
    if (!date) return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });
    const csv = await fetchBusinessLogsCSVByDate({ business_id, date });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="business_logs_${business_id}_${date}.csv"`);
    return res.send(csv);
  } catch (error) {
    log.error?.('exportBusinessLogsByDateController', error);
    return res.status(500).json({ message: 'Failed to export logs' });
  }
};
