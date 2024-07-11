import { Category } from "../models/category.model.js"
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import uploadCloudinary from "../utils/cloudinary.js";
// Create a new category
export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if ([name, description].some(field => !field || field.trim() === "")) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }

        if (!req.file) {
            return res.status(400).json(new ApiError(400, "Category Image is required"));
        }

        const existingCategory = await Category.findOne({ name: name });
        if (existingCategory) {
            return res.status(409).json(new ApiError(409, `${existingCategory.name} Category is Already Created`));
        }

        const CategoryImage = await uploadCloudinary(req.file.path);
        if (!CategoryImage) {
            throw new Error("Failed to upload image to Cloudinary");
        }


        const newCategory = await Category.create({ name, description, imageUrl: CategoryImage });
        res.status(201).json(new ApiResponse(200, `${newCategory.name} Category Add Successfully`));
    } catch (err) {
        res.status(500).json(new ApiError(500, err.message, "No Category Add"));
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(new ApiResponse(200, categories,));
        if (!categories) {
            return res.status(404).json(new ApiError(404, "No Category Available Right Now"))
        }

    } catch (err) {
        res.status(500).json(new ApiError(500, err.message, "Internal Server Error"));
    }
};
// Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json(new ApiError(404, "No Category Found"));
        }
        else {
            res.status(200).json(new ApiResponse(200, category));
        }
    } catch (err) {
        res.status(500).json(new ApiError(500, err.message, "Internal Server Error"));
    };
}
// Update a category by ID 
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (req.file) {
            const imageUrl = await uploadCloudinary(req.file.path);
            if (!imageUrl) {
                new Error("Failed to upload image to Cloudinary");
            }
            updatedFields.imageUrl = imageUrl;
        }
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json(new ApiError(404, "Category not found"));
        }

        res.status(200).json(new ApiResponse(200, "Category updated successfully", category));
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json(new ApiError(500, err.message, "Server Error Failed to update category"));
    }
};
// Delete a category by ID
export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json(new ApiError(404, "Category not found"));
        }
        res.status(200).json(new ApiResponse(200, "Category deleted successfully"));
    } catch (err) {
        res.status(500).json(new ApiError(500, err.message, "Internal Server Error"));
    }
};
