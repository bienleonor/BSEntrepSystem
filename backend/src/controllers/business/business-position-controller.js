// controller
import { getAllPositionsModel,addPositionModel } from '../../models/business/business-position-model.js';
import { logBusinessAction } from '../../services/business-logs-service.js';
import { MODULES, ACTIONS } from '../../constants/modules-actions.js';


export const getAllPositions = async (req, res) => {
  try {
    const positions = await getAllPositionsModel();
    res.status(200).json({
      success: true,
      data: positions,
    });
    // Avoid logging READ here to prevent noisy entries
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching positions",
    });
  }
};

export const addPosition = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const newPosition = await addPositionModel(role_name);

    res.status(201).json({
      success: true,
      data: newPosition,
      message: "Position added successfully",
    });
    // Log create action
    try {
      await logBusinessAction({
        business_id: Number(req.businessId || req.headers['x-business-id'] || req.body?.businessId || 0),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.BUSINESS_MANAGEMENT,
        action_id: ACTIONS.CREATE,
        table_name: 'business_position_table',
        record_id: Number(newPosition.business_pos_id),
        old_data: null,
        new_data: newPosition,
        req,
      });
    } catch (e) { /* swallow */ }
  } catch (error) {
    console.error("Error adding position:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding position",
    });
  }
};
