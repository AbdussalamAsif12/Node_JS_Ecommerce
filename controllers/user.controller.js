import { User } from "../models/user.model.js";
import isEmail from "validator/lib/isEmail.js";
import generateToken from "../utils/generateToken.js"
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import uploadCloudinary from "../utils/cloudinary.js";
// userRegister -- controller

const removeSpaces = (str) => str.replace(/\s+/g, '');
export const userRegister = async (req, res) => {
    try {
        let { username, fullName, email, password } = req.body;

        username = removeSpaces(username);

        if ([username, fullName, email, password].some(field => !field || field.trim() === "")) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }

        if (!isEmail(email)) {
            return res.status(400).json(new ApiError(400, "Invalid Email Address"));
        }

        if (password.length < 8) {
            return res.status(400).json(new ApiError(400, "Password must be at least 8 characters"));
        }

        if (username.length < 5) {
            return res.status(400).json(new ApiError(400, "Username must be at least 5 characters"));
        }


        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json(new ApiError(409, "This email or username is already taken! Try another one"));
        }

        const newUser = await User.create({
            username,
            fullName,
            email,
            password,
            profilePic: "/images/profilePic.jpg"
        });

        const { refreshToken } = await generateToken(newUser._id);
        newUser.refreshToken = refreshToken;
        await newUser.save({ validateBeforeSave: false });

        const createdUser = await User.findById(newUser._id).select("-password");
        if (createdUser) {
            return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
        }
        else {
            return res.status(500).json(new ApiError(500, "User registration failed"));
        }

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, "Internal Server Error",));
    }
};


// userLogin -- controller

export const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json(new ApiError(400, "Enter Both Fields"))
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json(new ApiError(404, "Username not Found ! Register Your Account"))
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json(new ApiError(401, "Incorrect Password"))
        }

        const { accessToken, refreshToken } = await generateToken(user._id);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, "Login Successfully")
            )


    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, "Internal Server Error",));
    }
}

// userLogout -- controller

export const userLogout = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError(401, "Unauthorized request!"));
        }

        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                new ApiResponse(200, "User Logout Successfully!")
            );
    } catch (err) {
        // console.error("User logout error:", error);
        return res.status(500).json(new ApiError(500, err.message, "Internal Server Error"));
    }
};


// updateUsername -- controller

export const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const checkUsername = await User.findOne({ username })
        if (checkUsername) {
            return res.status(409).json(new ApiError(409, "Username is not avalible"));
        }
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username }, { new: true });
        if (!updatedUser) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        res.status(200).json(new ApiResponse(200, "Username updated successfully", updatedUser));
    } catch (err) {
        console.error('Error updating username:', err);
        res.status(500).json(new ApiError(500, err.message, "Unable to update username"));
    }
};

// updateProfilePic -- controller

export const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(new ApiError(400, "Profile picture is required"));
        }
        const imageUrl = await uploadCloudinary(req.file.path);
        if (!imageUrl) {
            throw new Error("Failed to upload profile picture to Cloudinary");
        }
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePic: imageUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }
        res.status(200).json(new ApiResponse(200, "Profile picture uploaded and updated successfully", updatedUser));
    } catch (err) {
        console.error('Error uploading profile picture:', err);
        res.status(500).json(new ApiError(500, err.message, "Unable to upload profile picture"));
    }
}

// changePassword -- controller

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword || oldPassword.trim() === "" || newPassword.trim() === "") {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }
        const user = await User.findById(req.user._id);
        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordValid) {
            return res.status(401).json(new ApiError(401, "Incorrect old password"));
        }
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from old password" });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json(
            new ApiResponse(200, "Password Upadted Successfully")
        );

    } catch (err) {
        // console.error("Change password error:", err.message);
        return res.status(500).json(new ApiError(500, err.message, "Internal Server Error"));
    }
};

// fogertPassword -- controller

export const forgetPassword = async (req, res) => {

}