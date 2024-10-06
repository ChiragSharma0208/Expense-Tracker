import { Router } from "express";
import { getIncome, setIncome } from "../controllers/income.controller";
import { verifyJwt } from "../middlewares/auth";


const incomeRouter = Router();


incomeRouter.route("/setIncome").post(verifyJwt,setIncome);
incomeRouter.route("/getIncome").get(verifyJwt,getIncome);



export default incomeRouter;