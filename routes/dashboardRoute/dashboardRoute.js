const express = require('express');
const DashboardRouter = new express.Router();
const EmployeeModel = require('../../models/employeeModel');
const AttendanceModel = require('../../models/attendanceModel');

DashboardRouter.get('/api/get-statistics', async (req, res) => {
  const getToday = new Date().getDate();
  const getMonth = new Date().getMonth() + 1;
  const getYear = new Date().getFullYear();
  try {
    const getTotalEmployee = await EmployeeModel.find({ employmentStatus: 'Active' }).count();

    const totalTimeinToday = await AttendanceModel.aggregate([
      {
        $match: {
          $or: [{ 'timeData.timeInAM': { $ne: null } }, { 'timeData.timeInPM': { $ne: null } }],
          created: { $gte: new Date(`${getYear}-${getMonth}-${getToday}`) },
        },
      },
      {
        $group: {
          _id: '$email',
          uniqueValues: {
            $addToSet: '$email',
          },
        },
      },
    ]);

    const totalTimeOutToday = await AttendanceModel.aggregate([
      {
        $match: {
          $or: [{ 'timeData.timeOutAM': { $ne: null } }, { 'timeData.timeOutPM': { $ne: null } }],
          created: { $gte: new Date(`${getYear}-${getMonth}-${getToday}`) },
        },
      },
      {
        $group: {
          _id: '$email',
          uniqueValues: {
            $addToSet: '$email',
          },
        },
      },
    ]);

    const totalAbsencesYesterday = getTotalEmployee - totalTimeinToday.length;

    return res
      .status(201)
      .json({ status: 201, body: { getTotalEmployee, totalTimeinToday, totalTimeOutToday, totalAbsencesYesterday } });
  } catch (error) {
    console.log(error);
  }
});

module.exports = DashboardRouter;
