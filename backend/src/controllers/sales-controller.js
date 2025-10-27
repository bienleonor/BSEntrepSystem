import { getSalesTotal } from '../models/sales-model.js';
import { findRoleByName } from '../models/role-model.js'; // adjust path as needed

export const GetAllTotalSales = async (req, res) => {
  try {
    const businessId = req.user.business_id;
    const roleName = req.user.role;

    const result = await getSalesTotal(businessId);
    const roleDetails = await findRoleByName(roleName);

    res.json({
      total_sales: result.total_sales,
      role: roleDetails // or roleDetails.role_name, depending on what you want to expose
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
