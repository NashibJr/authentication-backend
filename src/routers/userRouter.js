import { Router } from "express";
import UserController from "../controllers/userController.js";
import authenticate from "../middlewares/authentication.js";
import validateInputs from "../middlewares/validationMiddlewares/validation.js";
import { sigupSchema } from "../middlewares/validationMiddlewares/userSchema.js";

const userRouter = Router();

userRouter.post(
  "/users/createuser",
  (req, resp, next) => validateInputs(req, resp, next)(sigupSchema),
  UserController.create
);
userRouter.post("/users/login", UserController.handleLogin);
userRouter.get("/users/getusers", UserController.getAllUsers);

export default userRouter;
