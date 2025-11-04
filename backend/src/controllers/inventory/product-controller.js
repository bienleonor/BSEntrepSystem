import { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct } from '../../models/inventory/product-model.js';

//create product without cloudinary
/*export const createProduct = async (req, res) => {
  try {
    const { name, businessId, unit, price, picture } = req.body;
    if (!name || !businessId || !unit || !price ||!picture) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const result = await addProduct({ name, businessId, unit, price, picture });
    res.status(201).json({
        message: "Product added successfully.",
        productId: result.insertId,
    });
    } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};*/



export const createProduct = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { name, businessId, unit_id, price, product_type } = req.body;
    const picture = req.file?.path;

    if (!name || !businessId || !unit_id || !price || !picture) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: "Price must be a non-negative number." });
    }

    const result = await addProduct({ name, businessId, unit_id, price, picture, product_type });

    res.status(201).json({
      message: "Product added successfully.",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};




export const fetchProductsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
        return res.status(400).json({ error: "Business ID is required." });
    }
    const products = await getProductsByBusiness(businessId);
    res.status(200).json(products);
    } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error." });
    }
};

export const fetchUnits = async (req, res) => {
  try {
    const units = await getUnits();
    res.status(200).json(units);
    } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Internal server error." });
    }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
    } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error." });
    }
};
export const fetchProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required." });
        }
        const product = await getProductById(productId);
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
export const modifyProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, businessId, unit_id, price, picture } = req.body;
        if (!productId || !name || !businessId || !unit_id || !price || !picture) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({ error: "Price must be a non-negative number." });
        }      
        await updateProduct(productId, { name, businessId, unit_id, price, picture });
        res.status(200).json({ message: "Product updated successfully." });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
export const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required." });
        }
        await deleteProduct(productId);
        res.status(200).json({ message: "Product deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};




export default { createProduct, fetchProductsByBusiness, fetchUnits, fetchAllProducts, fetchProductById, modifyProduct, removeProduct };


