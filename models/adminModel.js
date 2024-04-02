const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cipher = require("bcryptjs");
const keys = require("../config/keys");

const AdminSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  acctStatus: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await cipher.hash(this.password, 12);
  }
  next();
});

AdminSchema.methods.generateAuthToken = async function () {
  try {
    let token24 = jwt.sign({ _id: this._id }, keys.cookieKey, {
      expiresIn: "7d",
    });

    this.tokens = this.tokens.concat({ token: token24 });
    await this.save();
  } catch (error) {
    console.log(error);
  }
};

const AdminModel = new mongoose.model("AdminInfo", AdminSchema);

module.exports = AdminModel;
