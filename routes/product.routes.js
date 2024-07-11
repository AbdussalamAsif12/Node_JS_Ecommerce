import Router from "express"
const router = Router();
import {
    addProduct, allProducts, singleProduct, deleteProduct, updateProduct
} from "../controllers/product.controller.js";
import jwtVerify from "../middleware/auth.middleware.js";
import adminVerify from "../middleware/admin.middleware.js";
import upload from "../middleware/multer.middleware.js";
router.route("/addProduct").post(upload.single('imageUrls'), jwtVerify, adminVerify, addProduct);
router.route("/allProducts").get(allProducts);
router.route("/signleProduct/:id").get(singleProduct);
router.route("/deleteProduct/:id").delete(jwtVerify, adminVerify, deleteProduct);
router.route("/updateProduct/:id").put(upload.single('imageUrls'), jwtVerify, adminVerify, updateProduct);

export default router;