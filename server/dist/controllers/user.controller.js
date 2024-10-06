var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/user.model.js";
import createHttpError from "http-errors";
import uploadToCloudinary from "../utils/cloudinary.js";
const userRegisteration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    const exsistingUser = yield User.findOne({ email });
    if (exsistingUser) {
        const error = createHttpError(400, "User already exsist");
        next(error);
    }
    const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    try {
        let avatarUrl = "";
        if (avatar) {
            const cloudinaryResult = yield uploadToCloudinary(avatar);
            avatarUrl = (cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.secure_url) || "";
        }
        const userDoc = new User({
            firstName,
            lastName,
            email,
            password,
            avatar: avatarUrl,
        });
        yield userDoc.save();
        const token = userDoc.generateAccessToken();
        res.status(201).json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.code === 11000) {
                const err = createHttpError(400, "Email already exists");
                return next(err);
            }
            console.log(error.message);
            res.status(400).json({ message: error.message });
        }
        else {
            console.log("Unknown error occurred:", error);
            res.status(400).json({ message: "An unknown error occurred." });
        }
    }
});
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        const error = createHttpError(400, "Email is required");
        return next(error);
    }
    if (!password) {
        const error = createHttpError(400, "Email and password are required");
        return next(error);
    }
    try {
        const user = yield User.findOne({ email });
        if (!user) {
            const error = createHttpError(404, "User does'nt exsist");
            return next(error);
        }
        const isPasswordValid = yield user.checkPassword(password);
        if (!isPasswordValid) {
            const error = createHttpError(401, "Invalid password");
            return next(error);
        }
        const token = user.generateAccessToken();
        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
        });
    }
    catch (error) {
        console.log("Error occured while logging in");
        return next(error);
    }
});
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            const error = createHttpError(400, "Unable to fetch User");
            return next(error);
        }
        res.status(200).json({ success: true, user, message: "User fetched successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            const err = createHttpError(500, error.message);
            return next(err);
        }
        const err = createHttpError(500, "Unable to find user");
        return next(err);
    }
});
export { userRegisteration, userLogin, getUserById };
