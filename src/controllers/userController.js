import UserService from "../services/userService.js";

const UserController = {
  create: async (req, resp, next) => {
    try {
      const data = await UserService.createUser(req.body);
      return resp.status(201).json({
        student: data,
      });
    } catch (error) {
      return resp.status(400).json({
        message: "failed to ceate account",
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
      return resp.status(400).json({
        message: "An error has occured",
      });
    }
  },
};

export default UserController;
