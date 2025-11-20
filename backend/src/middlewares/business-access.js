import { findBusinessByUserId } from "../models/business/business-model.js";

export const requireBusinessAccess = async (req, res, next) => {
  try {
    // 1️⃣ Read header and params
    const headerBizRaw = req.get('X-Business-Id') || req.headers['x-business-id'];
    const headerBiz = headerBizRaw ? String(headerBizRaw).trim() : null;
    const paramBiz = req.params?.businessId ? String(req.params.businessId).trim() : null;

    // 2️⃣ Ensure authentication ran
    if (!req.user) {
      console.log('requireBusinessAccess: missing req.user');
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.user_id ?? req.user.userId ?? req.user.id;
    if (!userId) {
      console.log('requireBusinessAccess: req.user missing id field', req.user);
      return res.status(401).json({ error: "Authentication required" });
    }

    // 3️⃣ Determine businessId to use (header > param)
    const bizIdRaw = headerBiz || paramBiz;
    if (!bizIdRaw) {
      return res.status(400).json({ error: "Missing business id" });
    }
    const bizId = Number(bizIdRaw);
    if (isNaN(bizId)) {
      return res.status(400).json({ error: "Invalid business id" });
    }

    // 4️⃣ Check if user belongs to this business
    const businesses = await findBusinessByUserId(userId);
    const allowed = (businesses || []).map(b => Number(b.business_id));
    if (!allowed.includes(bizId)) {
      console.log('requireBusinessAccess: user does not belong to business', { userId, bizId, allowed });
      return res.status(403).json({ error: "Forbidden: You do not belong to this business" });
    }

    // 5️⃣ Attach numeric businessId to request
    req.businessId = bizId;
    console.log('requireBusinessAccess: success', { userId, bizId });

    next();
  } catch (err) {
    console.error('requireBusinessAccess error', err);
    return res.status(500).json({ error: "Server error" });
  }
};
