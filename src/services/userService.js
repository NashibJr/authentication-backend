import * as bcrypt from "bcrypt";
import User from "../database/models/user.js";
import Jwt from "jsonwebtoken";
import nodemailerSendgrid from "nodemailer-sendgrid";
import nodemailer from "nodemailer";

const UserService = {
  createUser: async (userdata) => {
    try {
      //check if the user already exists on the database
      const exists = await User.findOne({ username: userdata.username });

      if (exists) {
        return {
          message: "Account with the username already exists",
        };
      } else {
        const hashedPassword = await bcrypt.hash(userdata.password, 10);
        //create a token which will be used to send the comfirmation email to the user.
        const { email, username } = userdata;
        const token = Jwt.sign({ email, username }, process.env.JWT_SECRET, {
          expiresIn: "2 days",
        });

        // send the activation email to the user.
        const activationCode = (Math.random() * 10000000).toFixed(0);
        let user = await User.create({
          ...userdata,
          password: hashedPassword,
          status: "not activated",
          activationCode: activationCode,
        });
        const transport = nodemailer.createTransport(
          nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY })
        );
        transport.sendMail({
          from: "nashib.kigoonya@students.mak.ac.ug",
          to: email,
          subject: "Activation code",
          html: `Your activation code is ${activationCode}`,
        });
        user = user.toJSON();
        const { password, ...rest } = user;

        return { ...rest, token: token };
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
      "status",
    ]);
    if (!user) {
      return {
        message: "Account with that username is not available",
      };
    } else {
      // check if the user has provided the correct credentials.

      const correctCredentials = await bcrypt.compare(password, user.password);
      if (!correctCredentials) {
        return {
          message: "Password is incorrect",
        };
      } else {
        //generate a token

        const { _id, username, email, status } = user;
        const token = Jwt.sign(
          { _id, username, email, status },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        // check if the users account is activated or not.

        user = user.toJSON();
        delete user.password;

        return { ...user, token: token };
      }
    }
  },

  getUsers: async () => {
    let users = await User.find({})
      .sort({ username: 1 })
      .limit(10)
      .select("_id username email status activationCode");
    return users;
  },

  activateAccount: async (email, activationCode) => {
    const user = User.findOne({ email: email }).select(
      "email activationCode username"
    );
    return user;
  },
};

export default UserService;
