// controller
import { getAllPositionsModel,addPositionModel } from '../../models/business/business-position-model.js';


export const getAllPositions = async (req, res) => {
  try {
    const positions = await getAllPositionsModel();
    res.status(200).json({
      success: true,
      data: positions,
    });
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
  } catch (error) {
    console.error("Error adding position:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding position",
    });
  }
};
