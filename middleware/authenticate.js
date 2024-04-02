const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const AdminModel = require("../models/adminModel");

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const verifyToken = jwt.verify(token, keys.cookieKey);

    const rootUser = await AdminModel.findOne({ _id: verifyToken._id });

    if (!rootUser) {
      throw new Error("Unauthorized Access");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorize User, Token is not provided" });
  }
};

module.exports = authenticateAdmin;
