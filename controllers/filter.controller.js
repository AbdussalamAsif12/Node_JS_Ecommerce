import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
export const searchProducts = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    try {
        const products = await Product.find({ title: { $regex: query, $options: 'i' } });
        if (products.length > 0) {
            res.status(200).json(new ApiResponse(200, products));
        } else {
            res.status(404).json(new ApiError(404, 'No Products Found'));
        }
    } catch (err) {
        res.status(404).json(new ApiError(404, 'No Products Found'));
        res.status(500).json(new ApiError(500, err.message, "Internal Server Error!"));
    }
}