import User from "../database/models/user.js";
import * as bcrypt from "bcrypt";

const UserService = {
  createUser: async (userdata) => {
    try {
      //check if the user already exists on the database
      const exists = await User.findOne({ username: userdata.username });

      if (exists) {
        return {
          message: "Account already exists. Forgot password?",
        };
      } else {
        const hashedPassword = await bcrypt.hash(userdata.password, 10);
        let user = await User.create({ ...userdata, password: hashedPassword });
        user = user.toJSON();
        const { password, ...rest } = user;

        return rest;
      }
    } catch (error) {
      return {
        error: {
          statusCode: 500,
          message: "Internal server error",
        },
      };
    }
  },
};

export default UserService;
