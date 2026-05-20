import {
  getSy,
  getSection,
  getLatestGroup,
  insertAccessCode,
  findCode,
  addEmployeeToBusiness
} from "../models/access-code-model.js";

export const generateAccessCode = async (req, res) => {
  try {
    const { business_id, sy_id, sec_id } = req.body;

    const syData = await getSy(sy_id);
    const secData = await getSection(sec_id);

    const schoolYear = syData.school_year; // "2024-2025"
    const secName = secData.sec_name;      // "4A"

    // Compute short year (2425)
    const [year1, year2] = schoolYear.split("-");
    const shortYear = year1.slice(2) + year2.slice(2);

    // Next group number
    const groupNumber = await getLatestGroup(business_id);

    const finalCode = `${shortYear}-${secName}GR${groupNumber}`;

    const insertedId = await insertAccessCode(
      business_id,
      finalCode,
      new Date().getFullYear()
    );

    res.json({
      success: true,
      message: "Access code generated successfully!",
      code: finalCode,
      access_id: insertedId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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
