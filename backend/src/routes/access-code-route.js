import express from "express";
import {
  generateAccessCode,
  enterAccessCode
} from "../controllers/access-code-controller.js";

const router = express.Router();

router.post("/generate", generateAccessCode);
router.post("/enter", enterAccessCode);

export default router;
