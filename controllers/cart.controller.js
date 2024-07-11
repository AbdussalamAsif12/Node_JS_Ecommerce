import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json(new ApiError(404, 'Product not found'));
        }

        if (quantity <= 0) {
            return res.status(400).json(new ApiError(400, 'Quantity must be greater than 0'));
        }

        if (product.stockQuantity < quantity) {
            return res.status(400).json(new ApiError(400, 'Not enough product available in stock'));
        }
        
        const user = await User.findById(userId);
        
        // check user already add that product
        const cartItem = user.cart.find(item => item.product.equals(productId));
        
        // check if my current avalible product is less then my new and the previous product togther
        if (cartItem) {
            if (product.stockQuantity < cartItem.quantity + quantity) {
                return res.status(400).json(new ApiError(400, 'Not enough product available in stock'));
            }
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity, price: product.price, name: product.title }); // response 
        }
        await user.save();

        // user total bill

        const totalCartPrice = user.cart.reduce((total, item) => total + item.quantity * Number(item.price), 0);

        // user all orders quantity

        const totalOrderQuantity = user.cart.reduce((total, item) => total + Number(item.quantity), 0);

        // user all Cart orders

        const totalCartProducts = user.cart.length;
        res.status(200).json(new ApiResponse(200, 'Product added to cart', {
            cart: user.cart,
            totalCartPrice,
            totalOrderQuantity,
            totalCartProducts
        }));
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json(new ApiError(500, err.message, 'Server Error: Failed to add product to cart'));
    }
}
export const allCartItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json(new ApiError(404, 'User not found'));
        }

        res.status(200).json(new ApiResponse(200, 'Add to Cart Products', user.cart));
    } catch (err) {
        console.error('Error retrieving cart:', err);
        res.status(500).json(new ApiError(500, err.message, 'Server Error: Failed to retrieve cart'));
    }
}
export const UpdateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json(new ApiError(400, 'Quantity must be greater than 0'));
        }

        const user = await User.findById(userId);
        const cartItem = user.cart.find(item => item.product.equals(productId));
        if (!cartItem) {
            return res.status(404).json(new ApiError(404, 'Product not found in cart'));
        }

        cartItem.quantity = quantity;
        await user.save();

        res.status(200).json(new ApiResponse(200, 'Cart quantity updated', user.cart));
    } catch (err) {
        console.error('Error updating cart quantity:', err);
        res.status(500).json(new ApiError(500, err.message, 'Server Error: Failed to update cart quantity'));
    }
}
export const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => !item.product.equals(productId));
        await user.save();

        res.status(200).json(new ApiResponse(200, 'Product removed from cart', user.cart));
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).json(new ApiError(500, err.message, 'Server Error: Failed to remove product from cart'));
    }
}