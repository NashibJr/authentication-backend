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
      const user = await User.findById(payload._id);
      if (!user) {
        return resp.status(400).json({
          message: "you are not authorized",
        });
      } else {
        return next();
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
