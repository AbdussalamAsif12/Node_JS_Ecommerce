import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
const jwtVerify = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json(new ApiError(401, "Login Your Account"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // console.log(decodedToken);
        const user = await User.findOne({ _id: decodedToken?.userId }).select("-password -refreshToken");
        // console.log(user);
        if (!user) {
            return res.status(401).json(new ApiError(401, "Invalid Access Token"));
        }

        req.user = user;
        next();
    } catch (err) {
        // console.error("JWT verification error:", err);
        return res.status(500).json(new ApiError(500, `${err.message} Internal Server Error`));
    }
};

export default jwtVerify;
