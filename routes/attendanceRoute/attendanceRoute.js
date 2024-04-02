const express = require("express");
const AttendanceRouter = new express.Router();
const EmployeeModel = require("../../models/employeeModel");
const AttendanceModel = require("../../models/attendanceModel");

AttendanceRouter.post("/api/add/attendance", async (req, res) => {
  const { employeeId, status } = req.body;
  const today = new Date();

  const getEmployeeData = await EmployeeModel.findOne({
    employeeId: employeeId,
  });

  if (!getEmployeeData) {
    return res.status(404).json({ error: "Employee Data Not Found" });
  }

  try {
    const finalUser = new AttendanceModel({
      employeeId: getEmployeeData.employeeId,
      firstName: getEmployeeData.firstName,
      middleName: getEmployeeData.middleName,
      lastName: getEmployeeData.lastName,
      status,
      created: today.toISOString(),
      month: today.toLocaleString("default", { month: "long" }),
      year: today.getFullYear().toString(),
      role: getEmployeeData.role,
      department: getEmployeeData.department,
      email: getEmployeeData.email,
    });

    const storeData = await finalUser.save();

    return res.status(201).json(storeData);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

AttendanceRouter.get("/api/get-all-attendance", async (req, res) => {
  try {
    const getAllAttendance = await AttendanceModel.find().sort({ created: -1 });
    return res.status(201).json({ status: 200, body: getAllAttendance });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

module.exports = AttendanceRouter;
