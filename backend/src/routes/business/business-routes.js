
import express from "express";
import { getBusinessCategories, registerBusiness } from "../../controllers/business/business-controller.js";


const router = express.Router();

router.get("/categories", getBusinessCategories);
router.post("/registerbusiness", registerBusiness);


export default router;
