import Router from "express";
const router = Router();
import { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import jwtVerify from "../middleware/auth.middleware.js"
import adminVerify from "../middleware/admin.middleware.js";
import upload from "../middleware/multer.middleware.js";
router.use(jwtVerify, adminVerify);
router.route("/addCategory").post(upload.single('CategoryImage'), addCategory);
router.route("/allCategories").get(getCategories);
router.route("/SingleCategory/:id").get(getCategoryById);
router.route("/updateCategory/:id").put(updateCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);
export default router;