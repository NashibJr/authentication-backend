import * as bcrypt from "bcrypt";
import User from "../database/models/user.js";
import Jwt from "jsonwebtoken";

const UserService = {
  createUser: async (userdata) => {
    try {
      //check if the user already exists on the database
      const exists = await User.findOne({ username: userdata.username });

      if (exists) {
        return {
          message: "Account with the username already exists. Forgot password?",
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

  login: async (userCredentials) => {
    //chech if the user exists on the database

    const { username, password } = userCredentials;
    let user = await User.findOne({ username: username }).select([
      "username",
      "password",
      "email",
    ]);
    if (!user) {
      return null;
    } else {
      // check if the user has provided the correct credentials.

      const correctCredentials = await bcrypt.compare(password, user.password);
      if (!correctCredentials) {
        return {
          message: "Password is incorrect. Forgot password?",
        };
      } else {
        //generate a token

        const { _id, username, email } = user;
        const token = Jwt.sign(
          { _id, username, email },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );
        user = user.toJSON();
        delete user.password;

        return { ...user, token: token };
      }
    }
  },
};

export default UserService;
