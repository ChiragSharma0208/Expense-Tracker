import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import incomeRouter from "./routes/income.routes.js";
import expenseRouter from "./routes/expense.routes.js";
dotenv.config();
export const app = express();
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
//routes
app.use("/api/users", userRouter);
app.use("/api/incomes", incomeRouter);
app.use("/api/expenses", expenseRouter);
app.use((err, _, resp, next) => {
    const statusCode = err.statusCode || 500;
    resp.status(statusCode).json({
        message: err.message || "Something went wrong",
        success: false,
    });
});
