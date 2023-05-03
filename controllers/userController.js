import UserService from "../services/userService.js";

const UserController = {
  create: async (req, resp, next) => {
    try {
      const data = await UserService.createUser(req.body);
      return resp.status(201).json({
        student: data,
      });
    } catch (error) {
      return resp.status(401).json({
        message: "failed to ceate account",
      });
    }
  },
};

export default UserController;
