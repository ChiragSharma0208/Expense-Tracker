import { Router } from "express";
import { getExpense, setExpense } from "../controllers/expense.controller";
import { verifyJwt } from "../middlewares/auth";


const expenseRouter = Router();


expenseRouter.route("/setExpense").post(verifyJwt,setExpense);
expenseRouter.route("/getExpense").get(verifyJwt,getExpense);



export default expenseRouter;