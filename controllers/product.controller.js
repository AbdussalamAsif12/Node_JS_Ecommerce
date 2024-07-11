import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadCloudinary from "../utils/cloudinary.js";

// add Product

export const addProduct = async (req, res) => {
    try {
        const { title, description, price, category, stockQuantity, size } = req.body;
        if ([title, description, price, category, stockQuantity,size].some(field => !field || field.trim() === "")) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }
        if (!req.file) {
            return res.status(400).json(new ApiError(400, "Product Image is required"));
        }
        const productImageUrl = await uploadCloudinary(req.file.path);
        if (!productImageUrl) {
            throw new Error("Failed to upload image to Cloudinary");
        }
        const newProduct = await Product.create({
            title,
            description,
            price,
            category,
            stockQuantity,
            imageUrls: [productImageUrl],
            size
        });

        res.status(201).json(new ApiResponse(201, `${newProduct.title}`, "Product added successfully"));
    } catch (err) {
        console.error(err);
        res.status(500).json(new ApiError(500, err.message, "Internal Server Error"));
    }

}

// get all Products

export const allProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(new ApiResponse(200, 'Success', products));
    } catch (err) {
        console.error(err);
        res.status(500).json(new ApiError(500, err.message, 'Internal Server Error'));
    }
};

// get single Product

export const singleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(new ApiError(404, 'Product not found'));
        }
        res.status(200).json(new ApiResponse(200, 'Success', product));
    } catch (err) {
        // console.error(err);
        res.status(500).json(new ApiError(500, err.message, 'Internal Server Error'));
    }
};

// delete product

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json(new ApiError(404, 'Product not found'));
        }
        res.status(200).json(new ApiResponse(200, 'Success', `Product ${deletedProduct.title} deleted successfully`));
    } catch (err) {
        console.error(err);
        res.status(500).json(new ApiError(500, err.message, 'Internal Server Error'));
    }
};

// update Product

export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, category, stockQuantity } = req.body;
        const updateFields = {};

        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (price) updateFields.price = price;
        if (category) updateFields.category = category;
        if (stockQuantity) updateFields.stockQuantity = stockQuantity;
        if (req.file) {
            const imageUrls = await uploadCloudinary(req.file.path);
            if (!imageUrls) {
                new Error("Failed to upload image to Cloudinary");
            }
            updateFields.imageUrls = imageUrls;
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        }

        res.status(200).json(new ApiResponse(200, "Product updated successfully", product));
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json(new ApiError(500, err.message, "Server Error Failed to update product"));
    }
};



