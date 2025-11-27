import { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct,updateProductStatus, getactiveProducts,getInventoryWithProductDetailsByBusiness,getActiveInventoryWithProductDetailsByBusiness,addInventoryStock,updateinventoryStock, recordInventoryTransactionAndUpdateInventory } from '../../models/inventory/product-model.js';
import { addIngredient } from '../../models/inventory/recipe-model.js';
import { addComboItems } from '../../models/inventory/combo-model.js';
import cloudinary from '../../config/cloudinary.js'; // adjust path if needed
import fs from 'fs';

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
    const { name, businessId, unit_id, price, product_type, category_id } = req.body;

    // --- VALIDATION ---
    if (!name || !businessId || !unit_id || !price || !req.file) {
      return res.status(400).json({ error: "Missing required fields or image." });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: "Price must be a non-negative number." });
    }

    // --- UPLOAD IMAGE ---
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });

    const picture = cloudinaryResult.secure_url;

    // --- STEP 1: CREATE PRODUCT ---
    const result = await addProduct({
      name,
      businessId,
      unit_id,
      price,
      picture,
      product_type,
      localpath: req.file.path,
      category_id: category_id || null,
    });

    const productId = result.insertId;

    // --- STEP 2A: PROCESS RECIPE TYPE ---
    if (product_type?.toLowerCase() === "recipe") {
      let recipe = [];

      try {
        recipe = JSON.parse(req.body.recipe || "[]");
      } catch {
        return res.status(400).json({ error: "Invalid recipe JSON format." });
      }

      if (!Array.isArray(recipe) || recipe.length === 0) {
        return res.status(400).json({ error: "Recipe items are required for Recipe products." });
      }

      // Validate and insert each recipe ingredient
      for (const ing of recipe) {
        if (!ing.product_id || !ing.qty) {
          return res.status(400).json({
            error: "Each recipe ingredient must have product_id and qty."
          });
        }

        // ✅ MAP frontend fields to backend model
        await addIngredient({
          productId: productId,
          ingredientProductId: ing.product_id,
          consumptionAmount: ing.qty
        });
      }
    }

    // --- STEP 2B: PROCESS COMPOSITE TYPE ---
    if (product_type?.toLowerCase() === "composite") {
      let composite = [];

      try {
        composite = JSON.parse(req.body.recipe || "[]"); // frontend uses 'recipe' for both
      } catch {
        return res.status(400).json({ error: "Invalid composite JSON format." });
      }

      if (!Array.isArray(composite) || composite.length === 0) {
        return res.status(400).json({ error: "Composite items are required for composite products." });
      }

      // Validate composite items
      for (const item of composite) {
        if (!item.product_id || !item.qty) {
          return res.status(400).json({
            error: "Each composite item must have product_id and qty."
          });
        }
      }

      // ✅ MAP frontend fields to backend model
      const mappedComposite = composite.map(item => ({
        component_product_id: item.product_id,
        quantity: item.qty
      }));

      await addComboItems(productId, mappedComposite);
    }

    // --- CLEAN LOCAL FILE ---
    fs.unlink(req.file.path, () => {});

    // --- RESPONSE ---
    res.status(201).json({
      message: "Product added successfully.",
      productId,
    });

  } catch (error) {
    console.error("🔥 Error adding product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ... rest of your controller exports remain the same
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
    const { name, businessId, unit_id, price, product_type, picture: pictureFallback, category_id } = req.body;

    let pictureValue = pictureFallback || null;
    if (req.file) {
      const cloudRes = await cloudinary.uploader.upload(req.file.path, { folder: 'products', transformation: [{ width:800, height:800, crop:'limit' }] });
      pictureValue = cloudRes.secure_url;
      fs.unlink(req.file.path, (err) => { if (err) console.warn('unlink err', err); });
    }

    await updateProduct(productId, { name, businessId, unit_id, price, picture: pictureValue, product_type, category_id: category_id || null });
    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal server error.' });
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
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: "Invalid status value." });
    }

    await updateProductStatus(productId, is_active);
    res.status(200).json({ message: "Product status updated." });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const fetchProductWithInventoryDetails = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) {
      return res.status(400).json({ error: "Business ID is required." });
    }

    const parsedBusinessId = Number(businessId);
    if (isNaN(parsedBusinessId)) {
      return res.status(400).json({ error: "Business ID must be a number." });fetchActiveProductWithInventoryDetailsByBusiness
    }

    const products = await getInventoryWithProductDetailsByBusiness(parsedBusinessId);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching inventory details:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const fetchActiveProductWithInventoryDetailsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({ error: "Business ID is required." });
    }
    const products = await getActiveInventoryWithProductDetailsByBusiness(businessId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching inventory details by business:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const fetchActiveProducts = async (req, res) => {
  try {
    const products = await getactiveProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching active products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};






export default { createProduct, fetchProductsByBusiness, fetchUnits, fetchAllProducts, fetchProductById, modifyProduct, removeProduct, toggleProductStatus, fetchActiveProducts, fetchActiveProductWithInventoryDetailsByBusiness };


