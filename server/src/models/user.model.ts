import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface UserFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar?: string;
}

interface UserDocument extends Document, UserFields {
    checkPassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

const userSchema: Schema<UserDocument> = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
        type: String
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.checkPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN || "", { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

export const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);