import {
  fetchProductCategories,
  addProductCategory,
} from '../../models/inventory/product-category-model.js';
import { MODULES, ACTIONS } from '../../constants/modules-actions.js';
import { logAuditBusinessAction } from '../../services/audit-logs-service.js';
import { logBusinessAction } from '../../services/business-logs-service.js';

export const getProductCategories = async (req, res) => {
  const { businessId } = req.params;
  const id = Number(businessId);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: 'Invalid businessId parameter' });
  }
  try {   
    const categories = await fetchProductCategories(id);
    // Audit: user accessed product categories list
    try {
      const userId = req.user?.user_id || null;
      if (userId) {
        await logAuditBusinessAction({
          business_id: id,
          user_id: userId,
          module_id: MODULES.INVENTORY,
          action_id: ACTIONS.READ,
          table_name: 'product_category_table',
          record_id: 0, // NOT NULL in schema; 0 denotes list access
          new_data: { action: 'list_categories' },
          req,
        });
      }
    } catch (e) {
      console.warn('Audit log (GET product categories) failed:', e?.message);
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ message: 'Error fetching product categories', error: error.message });
  }
};
export const createProductCategory = async (req, res) => {
  const { name, description, businessId } = req.body;
    try {
    const categoryData = { name, description, businessId };
    const result = await addProductCategory(categoryData);
    const categoryId = (typeof result === 'object' && result !== null && 'insertId' in result)
      ? Number(result.insertId)
      : Number(result);
    // Business log (+ mirrored audit): category created
    try {
      const userId = req.user?.user_id || null;
      const bid = Number(businessId) || null;
      if (userId && bid) {
        await logBusinessAction({
          business_id: bid,
          user_id: userId,
          module_id: MODULES.INVENTORY,
          action_id: ACTIONS.CREATE,
          table_name: 'product_category_table',
          record_id: Number(categoryId || 0),
          old_data: null,
          new_data: { name, description },
          req,
        });
      }
    } catch (e) {
      console.warn('Business log (CREATE product category) failed:', e?.message);
    }
    res.status(201).json({ message: 'Product category created successfully', categoryId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product category', error: error.message });
  }
};

export default {
  getProductCategories,
  createProductCategory,
};