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
};

export default UserController;
