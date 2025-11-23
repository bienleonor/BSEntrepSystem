import {
  getUserDetails,
  fetchUserDetailsById,
  fetchUserDetails,
} from "../models/user-details-model.js";

// Insert or update user details
export const insertUserDetailsController = async (req, res) => {
  const requiredFields = [
    "first_name",
    "middle_name",
    "last_name",
    "contact_no",
    "section_id",
    "birthdate",
    "group_id",
    "year_id",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // contact no validation
  const contactRegex = /^09\d{9}$/;
  if (!contactRegex.test(req.body.contact_no)) {
    return res
      .status(400)
      .json({ error: 'contact_no must be 11 digits and start with "09"' });
  }

  try {
    const result = await getUserDetails(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Insert or update failed" });
    }

    res.json({ message: "User details saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch user details for currently logged-in user
// Fetch user details by ID param (public or non-logged)
export const getUserDetailsByIdController = async (req, res) => {
  try {
    const userId = req.params.id; // FIXED

    const userDetails = await fetchUserDetailsById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found"
      });
    }

    res.json(userDetails);
  } catch (err) {
    console.error("Get user details error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getUserDetailsController = async (req, res) => {
  try {
    const userId = req.params.id; // FIXED

    const userDetails = await fetchUserDetails(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found"
      });
    }
    res.json(userDetails);
  } catch (err) {
        console.error("Get user details error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

export const getLoggedInUserDetailsController = async (req, res) => {
  try {
    const userDetails = await fetchUserDetailsById(req.user.user_id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User details not found"
      });
    }

    res.json(userDetails);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};