const express = require("express");
const multer = require("multer");
const fs = require("fs");
const EmployeeRouter = new express.Router();
const EmployeeModel = require("../../models/employeeModel");

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = file.originalname.split("-");
    const folderPath = `./client/public/labels/${folderName[0]}`;
    fs.mkdirSync(folderPath, { recursive: true });
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.split("-");
    callback(null, fileName[1]);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only image is allowed"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

EmployeeRouter.post(
  "/api/add-employee",
  upload.array("photos", 12),
  async (req, res) => {
    const {
      employeeId,
      firstName,
      middleName,
      lastName,
      role,
      department,
      email,
    } = req.body;

    // validate if employee id exist
    const validate = await EmployeeModel.findOne({ employeeId: employeeId });
    if (validate) {
      return res.status(422).json({ error: "ID is already exists" });
    }

    try {
      const finalUser = new EmployeeModel({
        employeeId: employeeId.toUpperCase(),
        firstName: firstName.toUpperCase(),
        middleName: middleName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        created: new Date().toISOString(),
        role,
        department,
        email,
      });

      const storeData = await finalUser.save();

      return res.status(201).json(storeData);
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

EmployeeRouter.get("/api/employee", async (req, res) => {
  try {
    const allAccounts = await EmployeeModel.find().sort({ created: -1 });
    return res.status(200).json({ status: 200, body: allAccounts });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

EmployeeRouter.get("/api/get-employeeId", async (req, res) => {
  try {
    const allEmployeeId = await EmployeeModel.aggregate([
      {
        $project: {
          employeeId: -1,
        },
      },
    ]);
    return res.status(200).json({ status: 200, body: allEmployeeId });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

module.exports = EmployeeRouter;
