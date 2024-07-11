import Router from "express";
import { AdminDashboard } from "../controllers/admin.controller.js";
const router = Router();
import jwtVerify from "../middleware/auth.middleware.js";
import adminVerify from "../middleware/admin.middleware.js";
router.use(jwtVerify, adminVerify)
router.route("/adminDashboard").get(AdminDashboard);
export default router;