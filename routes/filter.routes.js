import Router from "express";
import { searchProducts } from "../controllers/filter.controller.js";
const router = Router();


router.route("/searchProduct").get(searchProducts)

export default router;