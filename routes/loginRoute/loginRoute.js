const express = require("express");
const SignInRouter = new express.Router();
const AdminModel = require("../../models/adminModel");
const cipher = require("bcryptjs");
const authenticateAdmin = require("../../middleware/authenticate");

// LOGIN

// ADMIN LOGIN
SignInRouter.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userEmail = await AdminModel.findOne({ email: email });
    if (userEmail) {
      const isMatch = await cipher.compare(password, userEmail.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Email or Password" });
      } else {
        const token = await userEmail.generateAuthToken();

        res.cookie("UserCookie", token, {
          expire: new Date(Date.now + 604800000),
          httpOnly: true,
        });

        const result = {
          userEmail,
          token,
        };
        return res.status(201).json({ status: 201, result });
      }
    } else {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
  }
});

// END OF LOGIN

// VALIDATE

// VALIDATE ADMIN LOGIN
SignInRouter.get("/api/valid", authenticateAdmin, async (req, res) => {
  try {
    const validUser = await AdminModel.findOne({ _id: req.userId });
    return res.status(201).json({ validUser });
  } catch (error) {
    console.log(error);
  }
});

// END OF VALIDATE

// LOGOUT

// LOGOUT ADMIN
SignInRouter.get("/api/logout", authenticateAdmin, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
      return currElem != req.token;
    });

    res.clearCookie("UserCookie", { path: "/" });

    req.rootUser.save();

    return res.status(201).json({ status: 201 });
  } catch (error) {
    console.log(error);
  }
});

// END OF LOGOUT

module.exports = SignInRouter;
