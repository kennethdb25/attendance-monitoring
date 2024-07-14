const express = require('express');
const AddReportRouter = new express.Router();
const PromisePool = require('@supercharge/promise-pool');
const EmployeeModel = require('../../models/employeeModel');
const ReportModel = require('../../models/reportsModel');
const AttendanceModel = require('../../models/attendanceModel');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

AddReportRouter.post('/api/report/generate', async (req, res) => {
  const { report, start, end, employeeId } = req.body;
  let fileName;
  switch (report) {
    case 'individual':
      fileName = `${employeeId}-time-in-and-time-out-${report}-generated-report-${new Date().getTime()}.csv`;
      break;
    default:
      fileName = `${new Date().getTime()}-${report}-generated-report.csv`;
      break;
  }
  let pathFile = path.resolve(__dirname, '../../file-uploads');
  const startDate = new Date(start);
  const endDate = new Date(end);

  let dataReport;
  let csvWriter;

  switch (report) {
    case 'employeeData':
      dataReport = await EmployeeModel.find({ employmentStatus: 'Active' }).sort({ lastname: -1 });

      csvWriter = createCsvWriter({
        header: [
          { id: 'employeeId', title: 'Employee ID' },
          { id: 'firstName', title: 'Employee First Name' },
          { id: 'middleName', title: 'Employee Middle Name' },
          { id: 'lastName', title: 'Employee Last Name' },
          { id: 'created', title: 'Created Date' },
          { id: 'role', title: 'Designation' },
          { id: 'department', title: 'Department' },
          { id: 'email', title: 'Employee' },
          { id: 'employerName', title: 'Company Name' },
          { id: 'employerAddress', title: 'Company Address' },
          { id: 'employerContact', title: 'Company Contact Details' },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
    case 'totalTimeInAndTimeOut':
      dataReport = await AttendanceModel.find({
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ lastname: -1 });

      csvWriter = createCsvWriter({
        header: [
          { id: 'employeeId', title: 'Employee ID' },
          { id: 'firstName', title: 'Employee First Name' },
          { id: 'middleName', title: 'Employee Middle Name' },
          { id: 'lastName', title: 'Employee Last Name' },
          { id: 'email', title: 'Employee' },
          { id: 'role', title: 'Designation' },
          { id: 'department', title: 'Department' },
          { id: 'employerName', title: 'Company Name' },
          { id: 'employerAddress', title: 'Company Address' },
          { id: 'employerContact', title: 'Company Contact Details' },
          { id: 'created', title: 'Attendance Date' },
          { id: 'month', title: 'Month' },
          { id: 'day', title: 'Day' },
          { id: 'year', title: 'Year' },
          { id: 'timeInAM', title: 'TIME-IN AM' },
          { id: 'timeOutAM', title: 'TIME-OUT AM' },
          { id: 'timeInPM', title: 'TIME-IN PM' },
          { id: 'timeOutPM', title: 'TIME-OUT PM' },
          { id: 'totalHoursToday', title: 'Total Hours Today' },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
    default:
      dataReport = await AttendanceModel.find({
        employeeId,
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ created: 1 });

      csvWriter = createCsvWriter({
        header: [
          { id: 'employeeId', title: 'Employee ID' },
          { id: 'firstName', title: 'Employee First Name' },
          { id: 'middleName', title: 'Employee Middle Name' },
          { id: 'lastName', title: 'Employee Last Name' },
          { id: 'email', title: 'Employee' },
          { id: 'role', title: 'Designation' },
          { id: 'department', title: 'Department' },
          { id: 'employerName', title: 'Company Name' },
          { id: 'employerAddress', title: 'Company Address' },
          { id: 'employerContact', title: 'Company Contact Details' },
          { id: 'created', title: 'Attendance Date' },
          { id: 'month', title: 'Month' },
          { id: 'day', title: 'Day' },
          { id: 'year', title: 'Year' },
          { id: 'timeInAM', title: 'TIME-IN AM' },
          { id: 'timeOutAM', title: 'TIME-OUT AM' },
          { id: 'timeInPM', title: 'TIME-IN PM' },
          { id: 'timeOutPM', title: 'TIME-OUT PM' },
          { id: 'totalHoursToday', title: 'Total Hours Today' },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
  }
  const { results } = await PromisePool.for(dataReport)
    .withConcurrency(300)
    .process((details) => {
      switch (report) {
        case 'employeeData':
          return {
            employeeId: details.employeeId,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            created: new Date(details.created).toLocaleString(),
            role: details.role,
            department: details.department,
            email: details.email,
            employerName: details.employerName,
            employerAddress: details.employerAddress,
            employerContact: details.employerContact,
          };
        case 'totalTimeInAndTimeOut':
          return {
            employeeId: details.employeeId,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            email: details.email,
            role: details.role,
            department: details.department,
            employerName: details.employerName,
            employerAddress: details.employerAddress,
            employerContact: details.employerContact,
            created: new Date(details.created).toLocaleString(),
            month: details.month,
            day: details.day,
            year: details.year,
            timeInAM: details.timeData?.timeInAM ? details.timeData?.timeInAM : 'NO RECORD',
            timeOutAM: details.timeData?.timeOutAM ? details.timeData?.timeOutAM : 'NO RECORD',
            timeInPM: details.timeData?.timeInPM ? details.timeData?.timeInPM : 'NO RECORD',
            timeOutPM: details.timeData?.timeOutPM ? details.timeData?.timeOutPM : 'NO RECORD',
            totalHoursToday: details.timeData?.totalHoursToday ? details.timeData?.totalHoursToday : 'NO RECORD',
          };
        case 'individual':
          return {
            employeeId: details.employeeId,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            email: details.email,
            role: details.role,
            department: details.department,
            employerName: details.employerName,
            employerAddress: details.employerAddress,
            employerContact: details.employerContact,
            created: new Date(details.created).toLocaleString(),
            month: details.month,
            day: details.day,
            year: details.year,
            timeInAM: details.timeData?.timeInAM ? details.timeData?.timeInAM : 'NO RECORD',
            timeOutAM: details.timeData?.timeOutAM ? details.timeData?.timeOutAM : 'NO RECORD',
            timeInPM: details.timeData?.timeInPM ? details.timeData?.timeInPM : 'NO RECORD',
            timeOutPM: details.timeData?.timeOutPM ? details.timeData?.timeOutPM : 'NO RECORD',
            totalHoursToday: details.timeData?.totalHoursToday ? details.timeData?.totalHoursToday : 'NO RECORD',
          };
      }
    });
  await csvWriter.writeRecords(results);
  try {
    const finalRecord = new ReportModel({
      filePath: fileName,
      created: new Date().toISOString(),
    });
    const storeData = await finalRecord.save();
    return res.status(201).json({ status: 201, body: storeData });
  } catch (error) {
    return res.status(422).json(error);
  }
});

AddReportRouter.get('/api/report/get-generated', async (req, res) => {
  try {
    const generatedReport = await ReportModel.find().sort({ created: -1 });
    return res.status(200).json({ status: 200, body: generatedReport });
  } catch (error) {
    return res.status(422).json(error);
  }
});

AddReportRouter.get('/api/report/download-csv', async (req, res) => {
  const file = req.query.filename || '';
  const pathFile = path.join(__dirname, `../../file-uploads/${file}`);

  res.download(pathFile, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occured' });
    }
  });
});

AddReportRouter.get('/api/print-dtr', async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;
  const employee = await EmployeeModel.findOne({ employeeId });

  const splitDate = startDate.split('-');
  const year = splitDate[0];
  const month = new Date(startDate).toLocaleString('default', { month: 'long' });

  if (employee) {
    const dtr = await AttendanceModel.find({
      employeeId,
      created: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ created: 1 });

    const result = dtr.map((x) => {
      return {
        day: x.day,
        month: x.month,
        year: x.year,
        timeData: x.timeData,
      };
    });
    let sum = 0;
    const arr = dtr.map((x) => {
      let total = 0;
      total = total + x.timeData.totalHoursToday;
      return total;
    });
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return res.status(200).json({ status: 200, body: { year, month, employee, result, sum } });
  }
});

module.exports = AddReportRouter;
