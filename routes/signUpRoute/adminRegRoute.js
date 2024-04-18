const express = require('express');
const multer = require('multer');
const AdminRegRouter = new express.Router();
const AdminModel = require('../../models/adminModel');

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('Only image is allowed'));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

// register admin
AdminRegRouter.post('/api/register', async (req, res) => {
  const { employeeId, firstName, middleName, lastName, userType, email, password } = req.body;

  // validate if employee id exist
  const validate = await AdminModel.findOne({ employeeId: employeeId });
  if (validate) {
    return res.status(422).json({ error: 'ID is already exists' });
  }

  try {
    const finalUser = new AdminModel({
      employeeId: employeeId.toString().toUpperCase(),
      firstName: firstName.toUpperCase(),
      middleName: middleName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      userType,
      acctStatus: 'Active',
      email,
      password,
    });

    const storeData = await finalUser.save();

    return res.status(201).json(storeData);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

AdminRegRouter.get('/api/accounts', async (req, res) => {
  try {
    const allAccounts = await AdminModel.find().sort({ lastName: -1 });
    return res.status(200).json({ status: 200, body: allAccounts });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

module.exports = AdminRegRouter;
