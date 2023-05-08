import Jwt from "jsonwebtoken";
import User from "../database/models/user.js";

const authenticate = async (req, resp, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    if (!token) {
      return resp.status(400).json({
        message:
          "You are not authorized, We didn't get your token. Try Logging in again",
      });
    } else {
      const payload = Jwt.verify(token, process.env.JWT_SECRET);
      const { _id, status } = payload;
      const user = await User.findById(_id);
      if (!user) {
        return resp.status(400).json({
          message: "you are not authorized",
        });
      } else {
        if (status === "not activated") {
          return resp.status(500).json({
            message:
              "Your account is not activated!. Check your email for the actiavtion code and activate your account",
          });
        } else {
          return next();
        }
      }
    }
  } catch (error) {
    return {
      statuscode: 500,
      error: "Authorization failed.",
    };
  }
};

export default authenticate;
