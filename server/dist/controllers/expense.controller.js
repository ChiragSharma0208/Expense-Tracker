var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Expense } from "../models/expense.model.js";
import createHttpError from "http-errors";
const setExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, amount, category, date, description } = req.body;
        if (!title || !amount || !category || !date) {
            const err = createHttpError(400, "All fields are required");
            next(err);
        }
        const prevExpense = yield Expense.findOne({ title });
        if (prevExpense) {
            const err = createHttpError(400, "Expense Already exsist");
            next(err);
        }
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return next(createHttpError(400, "Invalid date format"));
        }
        const expense = yield Expense.create({
            title,
            amount,
            category,
            date: parsedDate,
            description,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        yield expense.save();
        const checkExpense = yield Expense.findById({ _id: expense._id });
        if (!checkExpense) {
            const err = createHttpError(500, "Unable to create Expense");
            next(err);
        }
        res.status(200).json({
            success: true,
            checkExpense,
            message: "Expense created successfully"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error occured while setting income");
            const err = createHttpError(500, error.message);
            next(err);
        }
    }
});
const getExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const _id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!_id) {
            const err = createHttpError(400, "User not authenticated");
            return next(err);
        }
        const expense = yield Expense.find({ userId: _id }).select("-createdAt -updatedAt -userId -__v");
        ;
        if (!expense) {
            const err = createHttpError(500, "Expense not found");
            return next(err);
        }
        res.status(200).json({ success: true, expense, message: "Expense fetched successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error occured while setting income");
            const err = createHttpError(500, error.message);
            next(err);
        }
    }
});
export { setExpense, getExpense };
