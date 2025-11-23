import { addProduct, getProductsByBusiness, getUnits, getAllProducts, getProductById, updateProduct, deleteProduct,updateProductStatus, getactiveProducts,getActiveInventoryWithProductDetails,getActiveInventoryWithProductDetailsByBusiness,addInventoryStock,updateinventoryStock, recordInventoryTransactionAndUpdateInventory } from '../../models/inventory/product-model.js';
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
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const { name, businessId, unit_id, price, product_type } = req.body;

    // Validate required fields
    if (!name || !businessId || !unit_id || !price || !req.file) {
      return res.status(400).json({ error: "Missing required fields or image." });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ error: "Price must be a non-negative number." });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    });

    const picture = cloudinaryResult.secure_url;
    const localPath = req.file.path;

    // Insert product and initialize inventory
    const result = await addProduct({
      name,
      businessId,
      unit_id,
      price,
      picture,
      product_type,
      localpath: localPath,
    });

    // Clean up local file
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn('Failed to delete local file:', err.message);
    });

    res.status(201).json({
      message: "Product added successfully.",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("🔥 Error adding product:", error);
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
    const { name, businessId, unit_id, price, product_type, picture: pictureFallback } = req.body;

    // basic validation...
    // handle uploaded file
    let pictureValue = pictureFallback || null;
    if (req.file) {
      // if using local storage: upload file to cloudinary
      const cloudRes = await cloudinary.uploader.upload(req.file.path, { folder: 'products', transformation: [{ width:800, height:800, crop:'limit' }] });
      pictureValue = cloudRes.secure_url;
      // cleanup local file
      fs.unlink(req.file.path, (err) => { if (err) console.warn('unlink err', err); });
    }

    await updateProduct(productId, { name, businessId, unit_id, price, picture: pictureValue, product_type });
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

//product with inventory details

export const fetchProductWithInventoryDetails = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) {
      return res.status(400).json({ error: "Business ID is required." });
    }

    const parsedBusinessId = Number(businessId);
    if (isNaN(parsedBusinessId)) {
      return res.status(400).json({ error: "Business ID must be a number." });
    }

    const products = await getActiveInventoryWithProductDetail(parsedBusinessId);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching inventory details:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const fetchProductWithInventoryDetailsByBusiness = async (req, res) => {
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



export const insertInventoryStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body; 
    if (!productId || quantity == null ) {
      return res.status(400).json({ error: "Missing required fields." });
    }


    const result = await addInventoryStock({ productId, quantity });
    res.status(201).json({
      message: "Inventory stock added successfully.",
      inventoryId: result.insertId,
    });
    console.log("Adding inventory stock:", { productId, quantity });
  }
  catch (error) {
    console.error("Error adding inventory stock:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//wrong
export const modifyInventoryStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body; 
    if (!productId || quantity == null ) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const result = await updateinventoryStock({ productId, quantity });
    res.status(201).json({
      message: "Inventory stock updated successfully.",
      inventoryId: result.insertId,
    });
    console.log("Updating inventory stock:", { productId, quantity });
  }
  catch (error) {
    console.error("Error updating inventory stock:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Stock out endpoint: records an adjustment and decreases inventory
export const stockOut = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;
    if (!productId || quantity == null || !reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const parsedQty = Number(quantity);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }

    // Proof upload removed — frontend does not send files for stock-out anymore
    const proofUrl = null;

    const businessId = req.headers['x-business-id'] || null;
    // Token payload may use `user_id` or `id` depending on how token was generated
    const userId = req.user && (req.user.user_id || req.user.id) ? (req.user.user_id || req.user.id) : null;

    // change_qty is negative for stock out
    const change_qty = -Math.abs(parsedQty);
    // map frontend reason values to DB enum if needed
    let mappedReason = reason;
    if (reason === 'wastage') mappedReason = 'waste';

    await recordInventoryTransactionAndUpdateInventory({ productId, change_qty, reason: mappedReason, reference: proofUrl, businessId, userId });

    res.status(201).json({ message: 'Stock out recorded.' });
  } catch (err) {
    console.error('Error recording stock out:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


export default { createProduct, fetchProductsByBusiness, fetchUnits, fetchAllProducts, fetchProductById, modifyProduct, removeProduct, toggleProductStatus, fetchActiveProducts, fetchProductWithInventoryDetails, insertInventoryStock, stockOut };


