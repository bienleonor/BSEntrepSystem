// access-code-controller.js
import {
  getYear, getSection, insertAccessCode, findCode, addEmployeeToBusiness
} from "../models/access-codes-model.js";
import pool from "../config/pool.js";

export const generateAccessCode = async (req, res) => {
  try {
    const { business_id, year_id, section_id, group_id } = req.body;
    if (!business_id || !year_id || !section_id || !group_id) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: business_id, year_id, section_id, group_id",
        received: { business_id, year_id, section_id, group_id }
      });
    }

    const yearData = await getYear(year_id);

    const sectionData = await getSection(section_id);

    if (!yearData || !sectionData) {
      console.log("Year or Section not found");
      return res.status(404).json({
        success: false,
        message: "Year or Section not found",
        yearData,
        sectionData
      });
    }

    const schoolYear = yearData.school_year;
    const secName = sectionData.sec_name;
    console.log("schoolYear, secName:", schoolYear, secName);

    const parts = String(schoolYear).split("-");
    if (parts.length !== 2) {
      console.log("Unexpected school_year format:", schoolYear);
      return res.status(500).json({ success: false, message: "Invalid school_year format", schoolYear });
    }

    const [year1, year2] = parts;
    const shortYear = String(year1).slice(2) + String(year2).slice(2);

    const finalCode = `${shortYear}-${secName}GR${group_id}`;
    console.log("Generated finalCode:", finalCode);

    try {
      const insertedId = await insertAccessCode(business_id, finalCode, new Date().getFullYear());
      console.log("Access code inserted with ID:", insertedId);

      return res.status(201).json({
        success: true,
        message: "Access code generated successfully!",
        code: finalCode,
        access_id: insertedId
      });
    } catch (err) {
      console.error("Failed to insert access code:", err);
      return res.status(500).json({ success: false, message: "DB insert failed", error: err.message });
    }
  } catch (err) {
    console.error("Error in generateAccessCode:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const enterAccessCode = async (req, res) => {
  try {
    const { user_id, code } = req.body;

    const codeData = await findCode(code);

    if (!codeData)
      return res.status(404).json({ success: false, message: "Invalid code" });

    const business_id = codeData.business_id;

    await addEmployeeToBusiness(user_id, business_id);

    res.json({
      success: true,
      message: "User added as employee!",
      business_id
    });
  } catch (err) {
    console.error(err);
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

