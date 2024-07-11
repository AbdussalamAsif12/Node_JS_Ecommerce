import Router from "express";
import { userRegister, userLogin, userLogout, changePassword, forgetPassword, updateUsername, updateProfilePic } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
const router = Router();
import jwtVerify from "../middleware/auth.middleware.js";
router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(jwtVerify, userLogout);
router.route("/editUsername").put(jwtVerify, updateUsername)
router.route("/editProfilePic").put(jwtVerify, upload.single('profilePic'), updateProfilePic)
router.route("/changePassword").put(jwtVerify, changePassword);
router.route("/forgetPassword").put(jwtVerify, forgetPassword);

export default router;