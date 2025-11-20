import { findBusinessByUserId } from "../models/business/business-model.js";

export const requireBusinessAccess = async (req, res, next) => {
  const businessId = req.header("X-Business-ID");

  if (!businessId)
    return res.status(403).json({ error: "No business selected" });

  const userId = req.user.user_id;

  const businesses = await findBusinessByUserId(userId);

  const hasAccess = businesses.some(
    (b) => b.business_id === Number(businessId)
  );

  if (!hasAccess)
    return res.status(403).json({ error: "Forbidden: You do not belong to this business" });

  // attach businessId for controllers
  req.businessId = Number(businessId);

  next();
};
