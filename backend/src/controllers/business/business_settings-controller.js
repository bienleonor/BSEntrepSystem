import { updateBusinessInfo, upsertBusinessSetting, getBusinessSettings,getBusinessLogo } from '../../models/business/business-settings_model.js';
import { logBusinessAction } from '../../services/business-logs-service.js';
import { MODULES, ACTIONS } from '../../constants/modules-actions.js';
import { findBusinessByUserId } from '../../models/business/business-model.js';
import fs from 'fs';
import path from 'path';

export const getSettings = async (req, res) => {
  try {
    const businessId = req.headers['x-business-id'] || req.query.businessId || req.body.businessId;
    if (!businessId) return res.status(400).json({ error: 'Missing business id' });

    const settings = await getBusinessSettings(businessId);
    res.json({ success: true, settings });
  } catch (err) {
    console.error('getSettings error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const businessId = req.headers['x-business-id'] || req.body.businessId;
    if (!businessId) return res.status(400).json({ error: 'Missing business id' });

    const { businessName, businessType } = req.body;

    // Optional: verify user owns the business
    try {
      const owned = await findBusinessByUserId(req.user.user_id);
      const owns = owned.some(b => String(b.business_id) === String(businessId));
      if (!owns) {
        // Not owner: allow update? For now require ownership
        return res.status(403).json({ error: 'Not authorized to update this business' });
      }
    } catch (err) {
      console.error('ownership check failed', err);
    }

    // Update business name/category
    let oldBusiness = null;
    try { oldBusiness = await getBusinessSettings(businessId); } catch {}

    if (businessName || businessType) {
      await updateBusinessInfo(businessId, businessName || null, businessType || null);
    }

    // Handle logo file (multer sets req.file)
    let logoBlob = null;
    if (req.file) {
      // req.file is stored on disk by multer.diskStorage; read the file as buffer
      try {
        const fullPath = req.file.path || path.join(process.cwd(), 'uploads', req.file.filename);
        logoBlob = fs.readFileSync(fullPath);
        // optional: remove the temporary file now that blob is stored
        try { fs.unlinkSync(fullPath); } catch (e) { /* ignore unlink errors */ }
      } catch (e) {
        console.error('Failed to read uploaded logo file:', e);
      }
    }
    
    // Upsert business setting (logo blob) only if a new logo was uploaded
    if (logoBlob !== null) {
      await upsertBusinessSetting(businessId, logoBlob);
    }


    const settings = await getBusinessSettings(businessId);
    res.json({ success: true, message: 'Settings updated', settings });

    // Log update action
    try {
      await logBusinessAction({
        business_id: Number(businessId),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.BUSINESS_MANAGEMENT,
        action_id: ACTIONS.UPDATE,
        table_name: 'business_table',
        record_id: Number(businessId),
        old_data: oldBusiness,
        new_data: settings,
        req,
      });
    } catch (e) { console.warn('logBusinessAction (updateSettings) failed', e.message); }
  } catch (err) {
    console.error('updateSettings error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getLogo = async (req, res) => {
  try {
    const businessId = req.params.id || req.headers["x-business-id"];
    if (!businessId) {
      return res.status(400).json({ error: "Missing business id" });
    }

    const logoBlob = await getBusinessLogo(businessId);
    if (!logoBlob) {
      return res.status(404).send("Logo not found");
    }

    // Send blob as image (default to PNG, adjust if you store mime type)
    res.setHeader("Content-Type", "image/png");
    res.send(logoBlob);
  } catch (err) {
    console.error("getLogo error", err);
    res.status(500).send("Server error");
  }
};