// controllers/comboController.js
import { addComboItems, getComboByParent, deleteComboByParent } from '../../models/inventory/combo-model.js';
import { logBusinessAction } from '../../services/business-logs-service.js';
import { MODULES, ACTIONS } from '../../constants/modules-actions.js';

export const addCombo = async (req, res) => {
  try {
    const { parent_product_id, components } = req.body;

    if (!parent_product_id || !Array.isArray(components) || components.length === 0) {
      return res.status(400).json({ message: 'Parent product and components are required.' });
    }

    await addComboItems(parent_product_id, components);

    res.status(201).json({ message: 'Combo items added successfully.' });

    try {
      await logBusinessAction({
        business_id: Number(req.businessId || req.body.business_id || 0),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.MENU_PRODUCTS,
        action_id: ACTIONS.CREATE,
        table_name: 'combo_items_table',
        record_id: Number(parent_product_id),
        old_data: null,
        new_data: { parent_product_id, components_count: components.length },
        req,
      });
    } catch (e) {}
  } catch (err) {
    console.error('🔥 Combo add error:', err.message);
    res.status(500).json({ message: 'Failed to add combo items.' });
  }
};

export const getCombo = async (req, res) => {
  try {
    const parentProductId = req.params.parentProductId;
    const combo = await getComboByParent(parentProductId);
    res.json(combo);
  } catch (err) {
    console.error('🔥 Get combo error:', err.message);
    res.status(500).json({ message: 'Failed to fetch combo items.' });
  }
};

export const deleteCombo = async (req, res) => {
  try {
    const parentProductId = req.params.parentProductId;
    await deleteComboByParent(parentProductId);
    res.json({ message: 'Combo items deleted successfully.' });

    try {
      await logBusinessAction({
        business_id: Number(req.businessId || req.body.business_id || 0),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.MENU_PRODUCTS,
        action_id: ACTIONS.DELETE,
        table_name: 'combo_items_table',
        record_id: Number(parentProductId),
        old_data: { parent_product_id: parentProductId },
        new_data: null,
        req,
      });
    } catch (e) {}
  } catch (err) {
    console.error('🔥 Delete combo error:', err.message);
    res.status(500).json({ message: 'Failed to delete combo items.' });
  }
};

export default { addCombo, getCombo, deleteCombo };
