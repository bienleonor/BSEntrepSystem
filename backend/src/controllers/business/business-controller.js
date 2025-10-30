import { BusinessRegister, GetBusinessCategories } from "../../models/business/business-model.js"



export const registerBusiness = async (req, res) => {
  try {
    const { business_name, business_cat_id } = req.body;
    const owner_id = req.user.user_id; 

    if (!business_name || !business_cat_id || !owner_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const insertedId = await BusinessRegister({ business_name, business_cat_id, owner_id });

    res.status(201).json({
      message: "Business registered successfully.",
      business_id: insertedId,
    });
  } catch (error) {
    console.error("Error registering business:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



export const getBusinessCategories = async (req, res) => {
  try {
    const categories = await GetBusinessCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to load business categories." });
  }
};

