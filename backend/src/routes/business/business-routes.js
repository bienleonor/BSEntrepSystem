
import express from "express";
import { getBusinessCategories, registerBusiness,getUserBusiness } from "../../controllers/business/business-controller.js";


const router = express.Router();

router.get("/categories", getBusinessCategories);
router.post("/registerbusiness", registerBusiness);
router.get("/mybusinesses", getUserBusiness); // new route


export default router;
