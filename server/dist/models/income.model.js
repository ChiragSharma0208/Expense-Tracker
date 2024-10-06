import mongoose, { Schema } from "mongoose";
const incomeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    }
}, { timestamps: true });
export const Income = mongoose.model("Income", incomeSchema);
