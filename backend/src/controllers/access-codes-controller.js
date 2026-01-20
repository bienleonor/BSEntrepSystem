// access-code-controller.js
import {
  getYear, getSection, getGroup, insertAccessCode, findCode, addEmployeeToBusiness
} from "../models/access-codes-model.js";
import { buildAccessCode } from "../services/access-codes-service.js";
import pool from "../config/pool.js";
import { logBusinessAction } from "../services/business-logs-service.js";
import { MODULES, ACTIONS } from "../constants/modules-actions.js";

export const generateAccessCode = async (req, res) => {
  console.log("Incoming generateAccessCode:", req.body);

  try {
    const { business_id, year_id, section_id, group_id } = req.body;

    // 🟦 1. Fetch year, section, group NAME
    const yearData = await getYear(year_id);
    const sectionData = await getSection(section_id);
    const groupData = await getGroup(group_id);

    console.log("yearData:", yearData);
    console.log("sectionData:", sectionData);
    console.log("groupData:", groupData);

    if (!yearData || !sectionData || !groupData) {
      return res.status(400).json({
        success: false,
        message: "Invalid year, section, or group ID."
      });
    }

    const yearName = yearData.school_year;
    const sectionName = sectionData.sec_name;
    const groupName = groupData.group_name;

    console.log("✔ Year:", yearName);
    console.log("✔ Section:", sectionName);
    console.log("✔ Group:", groupName);

    // 🟩 2. Build access code
    const finalCode = buildAccessCode({
      schoolYear: yearName,
      sectionName,
      groupName
    });

    console.log("Generated Access Code:", finalCode);

    // 🟧 3. Insert into DB
    const insertId = await insertAccessCode(
      business_id,
      finalCode,
      new Date().getFullYear()
    );

    console.log("Inserted Access Code ID:", insertId);

    res.status(201).json({
      success: true,
      code: finalCode,
      access_id: insertId
    });

    // Log creation of access code (after responding for minimal latency)
    try {
      await logBusinessAction({
        business_id: Number(business_id),
        user_id: req.user?.user_id ?? null,
        module_id: MODULES.SYSTEM,
        action_id: ACTIONS.CREATE,
        table_name: 'access_codes_table',
        record_id: Number(insertId),
        old_data: null,
        new_data: { code: finalCode, year_created: new Date().getFullYear(), year: yearName, section: sectionName, group: groupName },
        req,
      });
    } catch (e) {
      console.warn('logBusinessAction (generateAccessCode) failed', e.message);
    }

  } catch (err) {
    console.error("❌ Error in generateAccessCode:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



export const enterAccessCode = async (req, res) => {
  try {
    const { user_id, code } = req.body;

    const codeData = await findCode(code);
    if (!codeData) {
      return res.status(404).json({ success: false, message: "Invalid code" });
    }

    const business_id = codeData.business_id;

    const employeeLinkId = await addEmployeeToBusiness(user_id, business_id);

    res.json({
      success: true,
      message: "User added as employee!",
      business_id,
      employee_link_id: employeeLinkId
    });

    // Log usage of access code and employee addition
    try {
      // Access code read/use
      await logBusinessAction({
        business_id: Number(business_id),
        user_id: req.user?.user_id ?? user_id ?? null,
        module_id: MODULES.SYSTEM,
        action_id: ACTIONS.READ,
        table_name: 'access_codes_table',
        record_id: Number(codeData.access_codes_id || 0),
        old_data: null,
        new_data: { code },
        req,
      });
      // Employee link creation
      await logBusinessAction({
        business_id: Number(business_id),
        user_id: req.user?.user_id ?? user_id ?? null,
        module_id: MODULES.BUSINESS_MANAGEMENT,
        action_id: ACTIONS.CREATE,
        table_name: 'business_user_position_table',
        record_id: Number(employeeLinkId),
        old_data: null,
        new_data: { user_id, business_id },
        req,
      });
    } catch (e) {
      console.warn('logBusinessAction (enterAccessCode) failed', e.message);
    }

  } catch (err) {
    console.error("❌ enterAccessCode error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/sectionController.js
export const getAllSections = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT sec_id, sec_name FROM section_table`);
    res.json(rows);
  } catch (err) {
    console.error("❌ DB error in getAllSections:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getAllGroups = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT group_id, group_name FROM group_table`);
    res.json(rows);
  } catch (err) {
    console.error("❌ DB error in getAllGroups:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getAllSchoolYear = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT year_id, school_year FROM year_table`);
    res.json(rows);
  } catch (err) {
    console.error("❌ DB error in getAllYears:", err);
    res.status(500).json({ error: err.message });
  }
};

