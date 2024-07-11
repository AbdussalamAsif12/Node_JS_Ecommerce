import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
        required: true
    },
    // slug: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true,
    // },


},
    {
        timestamps: true
    });


export const Category = mongoose.model("Category", categorySchema);
