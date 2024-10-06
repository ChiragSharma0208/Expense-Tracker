var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
export const verifyJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            const error = createHttpError(401, "token is required");
            return next(error);
        }
        const check = jwt.verify(token, process.env.ACCESS_TOKEN || "");
        const user = yield User.findById(check._id).select("-password");
        if (!user) {
            const error = createHttpError(401, "User is not authenticated");
            return next(error);
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            console.error("JWT Error Name:", error.name);
            console.error("JWT Error Message:", error.message);
        }
        const err = createHttpError(401, "Error occured while authenticating user with token");
        next(err);
    }
});
