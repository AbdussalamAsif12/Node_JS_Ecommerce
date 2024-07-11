import Router from "express";
const router = Router();
import { addToCart, allCartItems, UpdateCartItem, deleteCartItem } from "../controllers/cart.controller.js";
import jwtVerify from "../middleware/auth.middleware.js";
router.use(jwtVerify);

router.route("/addToCart").post(addToCart);
router.route("/allCartItems").get(allCartItems);
router.route("/updateCartItems").put(UpdateCartItem);
router.route("/deleteCartItems").delete(deleteCartItem)


export default router;