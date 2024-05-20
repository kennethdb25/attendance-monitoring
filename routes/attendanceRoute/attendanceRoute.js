const express = require('express');
const AttendanceRouter = new express.Router();
const EmployeeModel = require('../../models/employeeModel');
const AttendanceModel = require('../../models/attendanceModel');

AttendanceRouter.post('/api/add/attendance', async (req, res) => {
  const { employeeId, status } = req.body;
  const newDay = new Date();
  const convert = newDay.toLocaleString();
  const time = convert.split(', ');
  const today = new Date().toISOString();
  const param = today.split('T');

  const getEmployeeData = await EmployeeModel.findOne({
    employeeId: employeeId,
  });

  if (getEmployeeData?.employmentStatus === 'Resigned') {
    return res.status(404).json({ error: 'Resigned Employee' });
  }

  if (status === 'TIME-OUT') {
    const checkIfTimeGoFirstBeforeTimeOut = await AttendanceModel.findOne({
      employeeId,
      status: 'TIME-IN',
      created: { $gte: new Date(param[0]) },
    });

    if (!checkIfTimeGoFirstBeforeTimeOut) {
      return res.status(404).json({ error: 'No TIME-IN' });
    }
  }

  if (!getEmployeeData) {
    return res.status(404).json({ error: 'Employee Data Not Found' });
  }

  try {
    const checkAttendanceToday = await AttendanceModel.findOne({
      employeeId,
      status,
      created: { $gte: new Date(param[0]) },
    });
    if (!checkAttendanceToday) {
      const finalUser = new AttendanceModel({
        employeeId: getEmployeeData.employeeId,
        firstName: getEmployeeData.firstName,
        middleName: getEmployeeData.middleName,
        lastName: getEmployeeData.lastName,
        status,
        created: newDay.toISOString(),
        month: newDay.toLocaleString('default', { month: 'long' }),
        day: newDay.getDate(),
        time: time[1],
        year: newDay.getFullYear().toString(),
        role: getEmployeeData.role,
        department: getEmployeeData.department,
        email: getEmployeeData.email,
      });

      const storeData = await finalUser.save();

      return res.status(201).json({ status: 201, body: storeData });
    } else {
      res.status(403).json({ error: `${status} already completed` });
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

AttendanceRouter.get('/api/get-all-attendance', async (req, res) => {
  try {
    const getAllAttendance = await AttendanceModel.find().sort({ created: -1 });
    return res.status(201).json({ status: 200, body: getAllAttendance });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

AttendanceRouter.get('/api/graph-attendance', async (req, res) => {
  const yearNow = new Date().getFullYear();

  try {
    const attendanceGraphTimeIn = await AttendanceModel.aggregate([
      {
        $match: {
          status: 'TIME-IN',
          year: yearNow.toString(),
        },
      },
      {
        $group: {
          _id: '$month',
          count: { $count: {} },
        },
      },
    ]);

    const attendanceGraphTimeOut = await AttendanceModel.aggregate([
      {
        $match: {
          status: 'TIME-OUT',
          year: yearNow.toString(),
        },
      },
      {
        $group: {
          _id: '$month',
          count: { $count: {} },
        },
      },
    ]);

    return res.status(200).json({
      status: 200,
      body: { attendanceGraphTimeIn, attendanceGraphTimeOut },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = AttendanceRouter;
