import { Router } from "express";
import UserController from "../controllers/userController.js";
import authenticate from "../middlewares/authentication.js";
import validateInputs from "../middlewares/validationMiddlewares/validation.js";
import {
  activationCodeSchema,
  sigupSchema,
} from "../middlewares/validationMiddlewares/userSchema.js";

const userRouter = Router();

userRouter.post(
  "/users/createuser",
  (req, resp, next) => validateInputs(req, resp, next)(sigupSchema),
  UserController.create
);
userRouter.post("/users/login", UserController.handleLogin);
userRouter.get("/users/getusers", authenticate, UserController.getAllUsers);
userRouter.post(
  "/users/comfirm",
  (req, resp, next) => validateInputs(req, resp, next)(activationCodeSchema),
  UserController.activateUserAccount
);

export default userRouter;
