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

  const checkAttendanceToday = await AttendanceModel.findOne({
    employeeId,
    created: { $gte: new Date(param[0]) },
  });

  if (getEmployeeData?.employmentStatus === 'Resigned') {
    return res.status(404).json({ error: 'Resigned Employee' });
  }

  if (!getEmployeeData) {
    return res.status(404).json({ error: 'Employee Data Not Found' });
  }

  if (status === 'TIME-OUT') {
    const checkIfTimeGoFirstBeforeTimeOutAM = await AttendanceModel.findOne({
      employeeId,
      'timeData.timeInAM': { $ne: null },
      created: { $gte: new Date(param[0]) },
    });

    if (!checkIfTimeGoFirstBeforeTimeOutAM) {
      return res.status(404).json({ error: 'No TIME-IN AM' });
    }

    const checkIfTimeGoFirstBeforeTimeOutPM = await AttendanceModel.findOne({
      employeeId,
      'timeData.timeInPM': { $ne: null },
      created: { $gte: new Date(param[0]) },
    });

    const checkIfTimeFirstBeforeTimeOutAM = await AttendanceModel.findOne({
      employeeId,
      'timeData.timeOutAM': { $ne: null },
      created: { $gte: new Date(param[0]) },
    });

    if (checkIfTimeFirstBeforeTimeOutAM && !checkIfTimeGoFirstBeforeTimeOutPM) {
      return res.status(404).json({ error: 'No TIME-IN PM' });
    }
  }

  if (status === 'TIME-IN') {
    const checkIfTimeGoFirstBeforeTimeOutAM = await AttendanceModel.findOne({
      employeeId,
      'timeData.timeOutAM': { $ne: null },
      created: { $gte: new Date(param[0]) },
    });

    if (checkAttendanceToday && !checkIfTimeGoFirstBeforeTimeOutAM) {
      return res.status(404).json({ error: 'No TIME-OUT AM' });
    }

    const checkIfTimeGoFirstBeforeTimeOutPM = await AttendanceModel.findOne({
      employeeId,
      'timeData.timeInPM': { $ne: null },
      created: { $gte: new Date(param[0]) },
    });

    if (checkIfTimeGoFirstBeforeTimeOutPM) {
      return res.status(404).json({ error: 'Duplicate Entity' });
    }
  }

  try {
    if (!checkAttendanceToday) {
      const finalUser = new AttendanceModel({
        employeeId: getEmployeeData.employeeId,
        firstName: getEmployeeData.firstName,
        middleName: getEmployeeData.middleName,
        lastName: getEmployeeData.lastName,
        created: newDay.toISOString(),
        month: newDay.toLocaleString('default', { month: 'long' }),
        day: newDay.getDate(),
        timeData: {
          timeInAM: time[1],
          timeOutAM: null,
          timeInPM: null,
          timeOutPM: null,
          totalHoursToday: null,
        },
        monthCount: newDay.getMonth() + 1,
        year: newDay.getFullYear().toString(),
        role: getEmployeeData.role,
        department: getEmployeeData.department,
        email: getEmployeeData.email,
        employerName: getEmployeeData.employerName,
        employerAddress: getEmployeeData.employerAddress,
        employerContact: getEmployeeData.employerContact,
      });

      const storeData = await finalUser.save();

      return res.status(201).json({ status: 201, body: storeData });
    } else if (
      checkAttendanceToday &&
      checkAttendanceToday?.timeData.timeOutAM == null &&
      checkAttendanceToday?.timeData.timeInPM == null &&
      checkAttendanceToday?.timeData.timeOutPM == null
    ) {
      // if (new Date() <= new Date(`${param[0]}T04:00:00.000+00:00`)) {
      //   return res.status(401).json({ error: 'Unauthorized: Please Time-Out on or after 12:00 PM' });
      // }
      if (status) checkAttendanceToday.timeData.timeOutAM = time[1];

      let sumInTime1 =
        new Date(`${time[0]}, ${checkAttendanceToday.timeData.timeInAM}`).getTime() -
        new Date(`${time[0]}, ${checkAttendanceToday.timeData.timeOutAM}`).getTime();

      let sumInHours = sumInTime1 / (1000 * 60 * 60);

      if (status) checkAttendanceToday.timeData.totalHoursToday = Math.abs(sumInHours).toFixed(2);

      const updateData = await checkAttendanceToday.save();

      return res.status(201).json({ status: 201, body: updateData });
    } else if (
      checkAttendanceToday &&
      checkAttendanceToday?.timeData.timeOutAM &&
      checkAttendanceToday?.timeData.timeInPM === null &&
      checkAttendanceToday?.timeData.timeOutPM === null
    ) {
      // if (new Date() <= new Date(`${param[0]}T05:00:00.000+00:00`)) {
      //   return res.status(401).json({ error: 'Unauthorized: Please Time-Out on or after 1:00 PM' });
      // }
      if (status) checkAttendanceToday.timeData.timeInPM = time[1];

      const updateData = await checkAttendanceToday.save();

      return res.status(201).json({ status: 201, body: updateData });
    } else if (
      checkAttendanceToday &&
      checkAttendanceToday?.timeData.timeOutAM &&
      checkAttendanceToday?.timeData.timeInPM &&
      checkAttendanceToday?.timeData.timeOutPM === null
    ) {
      // if (new Date() <= new Date(`${param[0]}T09:00:00.000+00:00`)) {
      //   return res.status(401).json({ error: 'Unauthorized: Please Time-Out on or after 5:00 PM' });
      // }
      if (status) checkAttendanceToday.timeData.timeOutPM = time[1];

      let sumInTime1 =
        new Date(`${time[0]}, ${checkAttendanceToday.timeData.timeInAM}`).getTime() -
        new Date(`${time[0]}, ${checkAttendanceToday.timeData.timeOutAM}`).getTime();

      let sumInTime2 =
        new Date(`${time[0]}, ${checkAttendanceToday.timeData.timeInPM}`).getTime() - new Date().getTime();
      let sumInHours = (sumInTime1 + sumInTime2) / (1000 * 60 * 60);

      if (status) checkAttendanceToday.timeData.totalHoursToday = Math.abs(sumInHours).toFixed(2);

      const updateData = await checkAttendanceToday.save();

      return res.status(201).json({ status: 201, body: updateData });
    } else {
      return res.status(422).json({ error: 'Duplicate Entry' });
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
          $or: [{ 'timeData.timeInAM': { $ne: null } }, { 'timeData.timeInPM': { $ne: null } }],
          year: yearNow.toString(),
        },
      },
      {
        $sort: {
          monthCount: 1,
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
          $or: [{ 'timeData.timeOutAM': { $ne: null } }, { 'timeData.timeOutPM': { $ne: null } }],
          year: yearNow.toString(),
        },
      },
      {
        $sort: {
          monthCount: 1,
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
