import mongoose, { Schema } from "mongoose";
const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    }
}, { timestamps: true });
export const Expense = mongoose.model("Expense", expenseSchema);
