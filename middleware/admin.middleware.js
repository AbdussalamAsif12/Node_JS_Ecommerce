import ApiError from "../utils/ApiError.js";
const adminVerify = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== true) {
            return res.status(403).json(new ApiError(403, "Access forbidden Admin only"))
        }
        next();
    } catch (err) {
        // console.error("Admin verification error:", error);
        return res.status(500).json(new ApiError(500, `${err.message} Internal Server Error`))
    }
};

export default adminVerify;