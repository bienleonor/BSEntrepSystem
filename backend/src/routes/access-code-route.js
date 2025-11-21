import express from "express";
import {
  generateAccessCode,
  enterAccessCode,
  getAllSections,
} from "../controllers/access-code-controller.js";

const router = express.Router();

router.post("/generate", generateAccessCode);
router.post("/enter", enterAccessCode);
router.get("/sections", getAllSections);
export default router;
