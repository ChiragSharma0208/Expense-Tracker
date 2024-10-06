import { Router } from "express";
import { getIncome, setIncome } from "../controllers/income.controller.js";
import { verifyJwt } from "../middlewares/auth.js";
const incomeRouter = Router();
incomeRouter.route("/setIncome").post(verifyJwt, setIncome);
incomeRouter.route("/getIncome").get(verifyJwt, getIncome);
export default incomeRouter;
