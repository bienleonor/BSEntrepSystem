import { findBusinessByUserId } from "../models/business/business-model.js";

export const requireBusinessAccess = async (req, res, next) => {
  try {
    // 1️⃣ Ensure authentication ran
    if (!req.user) {
      console.log('requireBusinessAccess: missing req.user');
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.user_id ?? req.user.userId ?? req.user.id;
    if (!userId) {
      console.log('requireBusinessAccess: req.user missing id field', req.user);
      return res.status(401).json({ error: "Authentication required" });
    }

    // 2️⃣ BYPASS for superadmin - they have access to everything
    const userRole = (req.user.system_role || '').toLowerCase();
    if (userRole === 'superadmin') {
      // Still try to get businessId from header/param for context, but don't require it
      const headerBizRaw = req.get('X-Business-Id') || req.get('X-Business-ID') || req.headers['x-business-id'];
      const paramBiz = req.params?.businessId || req.params?.business_id;
      const bodyBiz = req.body?.businessId || req.body?.business_id;
      const bizIdRaw = headerBizRaw || paramBiz || bodyBiz;
      
      if (bizIdRaw) {
        req.businessId = Number(bizIdRaw);
      }
      
      return next();
    }

    // 3️⃣ Read header and params
    const headerBizRaw = req.get('X-Business-Id') || req.get('X-Business-ID') || req.headers['x-business-id'] || req.headers['x-business-id'];
    const headerBiz = headerBizRaw ? String(headerBizRaw).trim() : null;
    const paramBiz = (req.params?.businessId || req.params?.business_id) ? String(req.params.businessId || req.params.business_id).trim() : null;

    // 4️⃣ Determine businessId to use (header > param)
    const bodyBiz = req.body?.businessId || req.body?.business_id || null;
    const bizIdRaw = headerBiz || paramBiz || bodyBiz;
    if (!bizIdRaw) {
      return res.status(400).json({ error: "Missing business id" });
    }
    const bizId = Number(bizIdRaw);
    if (isNaN(bizId)) {
      return res.status(400).json({ error: "Invalid business id" });
    }

    // 5️⃣ Check if user belongs to this business
    const businesses = await findBusinessByUserId(userId);
    const allowed = (businesses || []).map(b => Number(b.business_id));
    if (!allowed.includes(bizId)) {
      console.log('requireBusinessAccess: user does not belong to business', { userId, bizId, allowed });
      return res.status(403).json({ error: "Forbidden: You do not belong to this business" });
    }

    // 6️⃣ Attach numeric businessId to request
    req.businessId = bizId;

    next();
  } catch (err) {
    console.error('requireBusinessAccess error', err);
    return res.status(500).json({ error: "Server error" });
  }
};
