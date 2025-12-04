import { BusinessRegister, GetBusinessCategories, findBusinessByUserId,Getallbusinesses,deleteBusinessById } from "../../models/business/business-model.js"
import { generateToken } from "../../utils/generate-token.js";
import { addEmployeeModel } from "../../models/business/business-employee-model.js";
import { findAccessCodeByBusiness, findExistingBusinessByUserGroup } from "../../models/access-codes-model.js";
import { fetchUserDetailsById } from "../../models/user-details-model.js";
import { MODULES, ACTIONS } from "../../constants/modules-actions.js";
import { logAuditBusinessAction } from "../../services/audit-logs-service.js";



export const registerBusiness = async (req, res) => {
  try {
    const { business_name, business_cat_id } = req.body;
    const owner_id = req.user.user_id; 

    if (!business_name || !business_cat_id || !owner_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Get user details to check section and group
    const userDetails = await fetchUserDetailsById(owner_id);
    
    if (!userDetails || !userDetails.section_id || !userDetails.group_id) {
      return res.status(400).json({ 
        error: "Please complete your profile with section and group information before registering a business." 
      });
    }

    // Check if a business already exists with the same section and group combination
    const existingBusiness = await findExistingBusinessByUserGroup(
      userDetails.section_id, 
      userDetails.group_id
    );

    if (existingBusiness) {
      return res.status(409).json({ 
        error: `A business already exists for your section and group: "${existingBusiness.business_name}". Only one business is allowed per section-group combination.`,
        existing_business: {
          business_id: existingBusiness.business_id,
          business_name: existingBusiness.business_name,
          access_code: existingBusiness.code
        }
      });
    }

    // Register business
    const insertedId = await BusinessRegister({ business_name, business_cat_id, owner_id });

    const OWNER_POSITION_ID = 1; // Change this if your Owner = different ID

    await addEmployeeModel(owner_id, insertedId, OWNER_POSITION_ID);

    // Audit log for business registration (explicit commit ensures business_id present)
    try {
      await logAuditBusinessAction({
        business_id: insertedId,
        user_id: owner_id,
        module_id: MODULES.BUSINESS_MANAGEMENT,
        action_id: ACTIONS.CREATE,
        table_name: 'business_table',
        record_id: insertedId,
        new_data: { business_name, business_cat_id, owner_id },
        req,
      });
    } catch (e) {
      console.warn('Failed to audit business registration:', e?.message);
    }

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


export const getBusinessAccessCode = async (req, res) => {
  try {
    const businessId = req.query.businessId || req.businessId;

    if (!businessId)
      return res.status(400).json({ error: "Missing businessId" });

    const code = await findAccessCodeByBusiness(businessId);

    if (!code)
      return res.status(404).json({ error: "No access code found" });

    return res.json({ code: code.code });

  } catch (error) {
    console.error("Error getting business access code:", error);
    return res.status(500).json({ error: "Server error" });
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

export const getAllBusinessescontroller = async (req, res) => {
  try {
    const { status } = req.query;

    // Map frontend status strings to numeric DB values
    // 'ACTIVE' -> 1, 'OFFLINE' -> 0, otherwise undefined (no filter)
    let statusFilter = null;
    if (typeof status === 'string') {
      const s = status.toUpperCase();
      if (s === 'ACTIVE') statusFilter = 1;
      else if (s === 'OFFLINE') statusFilter = 0;
    } else if (status === 1 || status === 0) {
      statusFilter = status;
    }

    const businesses = await Getallbusinesses(statusFilter);
    res.status(200).json(businesses);
  } catch (error) {
    console.error("Error fetching all businesses:", error);
    res.status(500).json({ error: "Failed to load all businesses." });
  }
};

export const deleteBusinessController = async (req, res) => {
  try {
    const { businessId } = req.params;  
    if (!businessId) {
      return res.status(400).json({ error: "Missing businessId parameter." });
    } 
    // Log the delete action before removing the business
    try {
      await logAuditBusinessAction({
        business_id: Number(businessId),
        user_id: req.user?.user_id,
        module_id: MODULES.BUSINESS_MANAGEMENT,
        action_id: ACTIONS.DELETE,
        table_name: 'business_table',
        record_id: Number(businessId),
        old_data: { business_id: Number(businessId) },
        new_data: null,
        req,
      });
    } catch (e) {
      console.warn('Failed to audit business deletion:', e?.message);
    }

    await deleteBusinessById(businessId);
    res.status(200).json({ success: true, message: "Business deleted successfully." });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ error: "Failed to delete business." });
  } 
};
