import { Router } from "express";
import UserController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/user/createuser", UserController.create);
userRouter.post("/user/login", UserController.handleLogin);

export default userRouter;
