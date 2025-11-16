import { BusinessRegister, GetBusinessCategories, findBusinessByUserId  } from "../../models/business/business-model.js"
import { generateToken } from "../../utils/generate-token.js";

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




export const getUserBusiness = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const businesses = await findBusinessByUserId(userId);

    res.status(200).json(businesses);
  } catch (error) {
    console.error("Error fetching user businesses:", error);
    res.status(500).json({ error: "Failed to load businesses." });
  }
};

export const selectBusiness = async (req, res) => {
  const { businessId } = req.body;
  const userId = req.user.user_id;

  const businesses = await findBusinessByUserId(userId);
  const ownsBusiness = businesses.some(b => b.business_id === parseInt(businessId));

  if (!ownsBusiness) {
    return res.status(403).json({ error: "Not authorized for this business" });
  }

  const token = generateToken({
    user_id: userId,
    username: req.user.username,
    role: req.user.role,
    business_id: businessId
  });

  res.json({ token });
};

