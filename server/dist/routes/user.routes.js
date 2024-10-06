import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { getUserById, userLogin, userRegisteration } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.js";
const userRouter = Router();
userRouter.route("/register").post(upload.single("avatar"), userRegisteration);
userRouter.route("/login").post(userLogin);
userRouter.route("/getUserById").get(verifyJwt, getUserById);
export default userRouter;
