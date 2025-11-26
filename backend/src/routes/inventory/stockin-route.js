import express from "express";
import { stockInController } from "../../controllers/inventory/stockin-controller.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const router = express.Router();

router.post("/stockin", authMiddleware, stockInController);

export default router;
