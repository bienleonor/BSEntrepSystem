import { BusinessRegister, GetBusinessCategories, findBusinessByUserId  } from "../../models/business/business-model.js"
import { generateToken } from "../../utils/generate-token.js";
import { addEmployeeModel } from "../../models/business/business-employee-model.js";



export const registerBusiness = async (req, res) => {
  try {
    const { business_name, business_cat_id } = req.body;
    const owner_id = req.user.user_id; 

    if (!business_name || !business_cat_id || !owner_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Register business
    const insertedId = await BusinessRegister({ business_name, business_cat_id, owner_id });

    const OWNER_POSITION_ID = 1; // Change this if your Owner = different ID

    await addEmployeeModel(owner_id, insertedId, OWNER_POSITION_ID);

    res.status(201).json({
      success: true,
      message: "Business registered successfully and Owner added to business_user_position_table.",
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

// export const selectBusiness = async (req, res) => {
//   const { businessId } = req.body;
//   const userId = req.user.user_id;

//   const businesses = await findBusinessByUserId(userId);
//   const ownsBusiness = businesses.some(b => b.business_id === parseInt(businessId));

//   if (!ownsBusiness) {
//     return res.status(403).json({ error: "Not authorized for this business" });
//   }

//   const token = generateToken({
//     user_id: userId,
//     username: req.user.username,
//     role: req.user.role,
//     business_id: businessId
//   });

//   res.json({ token });
// };

