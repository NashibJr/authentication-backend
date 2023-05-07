import User from "../database/models/user.js";
import UserService from "../services/userService.js";
import Jwt from "jsonwebtoken";

const UserController = {
  create: async (req, resp, next) => {
    try {
      const data = await UserService.createUser(req.body);
      return resp.status(201).json({
        student: data,
      });
    } catch (error) {
      return resp.status(400).json({
        message: "failed to create account",
      });
    }
  },

  handleLogin: async (req, resp, next) => {
    try {
      const data = await UserService.login(req.body);
      return resp.status(200).json({
        user: data,
      });
    } catch (error) {
      return resp.status(500).json({
        message: "An error has occured",
      });
    }
  },

  getAllUsers: async (req, resp, next) => {
    const data = await UserService.getUsers();
    return resp.status(200).json({
      users: data,
    });
  },

  activateUserAccount: async (req, resp, next) => {
    try {
      const headers = req.headers;
      const token = headers.authorization.split(" ")[1];
      const payload = Jwt.verify(token, process.env.JWT_SECRET);
      const data = await UserService.activateAccount(payload.email, req.body);
      if (req.body.codeFromUser === data.activationCode) {
        await User.findOneAndUpdate(
          { email: payload.email },
          { status: "activated" }
        );
        return resp.status(200).json({
          message: "Your account has been successfully activated!!",
        });
      } else {
        return resp.status(200).json({
          message: "Wrong code submitted!",
        });
      }
    } catch (error) {
      return resp.status(401).status({
        message: "An error has occured",
      });
    }
  },
};

export default UserController;
