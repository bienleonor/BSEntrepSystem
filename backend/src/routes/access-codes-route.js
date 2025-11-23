import express from "express";
import {
  generateAccessCode,
  enterAccessCode,
  getAllSections,
  getAllGroups,
  getAllSchoolYear,
} from "../controllers/access-codes-controller.js";

const router = express.Router();

router.post("/generate", generateAccessCode);
router.post("/enter", enterAccessCode);
router.get("/sections", getAllSections);
router.get("/groups", getAllGroups);
router.get("/schoolyears", getAllSchoolYear);

export default router;
