const express = require("express");
const ForgotPassRouter = new express.Router();
const cipher = require("bcryptjs");
const AdminModel = require("../../models/adminModel");

ForgotPassRouter.get("/api/forgot-password/:email", async (req, res) => {
  try {
    const getEmail = await AdminModel.findOne({ email: req.params.email });
    if (getEmail) {
      return res.status(200).json({
        status: 200,
        body: "Email Matched. Please click send button for OTP",
      });
    } else {
      return res
        .status(422)
        .json({ status: 422, body: "Email didn't match our records" });
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

ForgotPassRouter.patch("/api/forgot-password/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const password = await cipher.hash(req.body.password, 12);
    const confirmPassword = await cipher.hash(req.body.confirmPassword, 12);

    const getEmail = await AdminModel.findOne({ email: email });

    await getEmail.updateOne({
      password: password,
      confirmPassword: confirmPassword,
    });

    return res
      .status(200)
      .json({ status: 200, body: "Recovered Successfully" });
  } catch (error) {
    return res.status(404).json(error);
  }
});

module.exports = ForgotPassRouter;
