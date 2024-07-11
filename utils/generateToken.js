import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // accessToken store in browser cookie for short time
        const accessToken = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email,
                userRole: user.role
            },
            process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

        // refreshToken store in database for long time
        const refreshToken = jwt.sign(
            {
                userId: user._id,
                userRole: user.role
            }, process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error.message);
        throw new Error("Error generating tokens");
    }
};

export default generateToken