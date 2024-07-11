import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    imageUrls: [{
        type: String,
        required: true
    }],
    stockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    size: {
        type: String,
        // required: true,
        enum: ['S', 'M', 'L', 'XL'], // Example sizes
        default: 'M'
    },
}
    ,
    {
        timestamps: true
    });
export const Product = mongoose.model('Product', productSchema);
