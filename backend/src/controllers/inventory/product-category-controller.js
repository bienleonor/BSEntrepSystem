import {
  fetchProductCategories,
  addProductCategory,
} from '../../models/inventory/product-category-model.js';

export const getProductCategories = async (req, res) => {
  const { businessId } = req.params;
  const id = Number(businessId);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: 'Invalid businessId parameter' });
  }
  try {   
    const categories = await fetchProductCategories(id);
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
    res.status(201).json({ message: 'Product category created successfully', categoryId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product category', error: error.message });
  }
};

export default {
  getProductCategories,
  createProductCategory,
};