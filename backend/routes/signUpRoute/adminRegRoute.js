const express = require('express');
const AdminRegRouter = new express.Router();
const AdminModel = require('../../models/adminModel');

// register admin
AdminRegRouter.post('/api/register', async (req, res) => {
  const { employeeId, firstName, middleName, lastName, email, password } = req.body;

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
      userType: 'Super Admin',
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
