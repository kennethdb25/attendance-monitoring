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
      dataReport = await EmployeeModel.find({
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      csvWriter = createCsvWriter({
        header: [
          { id: 'employeeId', title: 'Employee ID' },
          { id: 'firstName', title: 'Employee First Name' },
          { id: 'middleName', title: 'Employee Middle Name' },
          { id: 'lastName', title: 'Employee Last Name' },
          { id: 'created', title: 'Created Date' },
          { id: 'role', title: 'Role' },
          { id: 'department', title: 'Department' },
          { id: 'email', title: 'Employee' },
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
      });

      csvWriter = createCsvWriter({
        header: [
          { id: 'employeeId', title: 'Employee ID' },
          { id: 'firstName', title: 'Employee First Name' },
          { id: 'middleName', title: 'Employee Middle Name' },
          { id: 'lastName', title: 'Employee Last Name' },
          { id: 'status', title: 'Status' },
          { id: 'created', title: 'Time-in/Time-out Date' },
          { id: 'role', title: 'Role' },
          { id: 'department', title: 'Department' },
          { id: 'email', title: 'Employee' },
          { id: 'month', title: 'Month' },
          { id: 'year', title: 'Year' },
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
      });

      csvWriter = createCsvWriter({
        header: [
          { id: 'employeeId', title: 'Employee ID' },
          { id: 'firstName', title: 'Employee First Name' },
          { id: 'middleName', title: 'Employee Middle Name' },
          { id: 'lastName', title: 'Employee Last Name' },
          { id: 'status', title: 'Status' },
          { id: 'created', title: 'Time-in/Time-out Date' },
          { id: 'role', title: 'Role' },
          { id: 'department', title: 'Department' },
          { id: 'email', title: 'Employee' },
          { id: 'month', title: 'Month' },
          { id: 'year', title: 'Year' },
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
          };
        case 'totalTimeInAndTimeOut':
          return {
            employeeId: details.employeeId,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            status: details.status,
            created: new Date(details.created).toLocaleString(),
            role: details.role,
            department: details.department,
            email: details.email,
            month: details.month,
            year: details.year,
          };
        case 'individual':
          return {
            employeeId: details.employeeId,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            status: details.status,
            created: new Date(details.created).toLocaleString(),
            role: details.role,
            department: details.department,
            email: details.email,
            month: details.month,
            year: details.year,
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
  const { employeeId, startDate, year } = req.query;
  const endDate = parseInt(startDate) + 1;

  const dateNow = new Date(`${year}-${startDate}`);
  const month = dateNow.toLocaleString('default', { month: 'long' });
  const employee = await EmployeeModel.findOne({ employeeId });

  if (employee) {
    const dtr = await AttendanceModel.find({
      employeeId,
      created: { $gte: new Date(`${year}-${startDate}`), $lt: new Date(`${year}=${endDate}`) },
    }).sort({ created: 1 });

    const result = dtr.map((x) => {
      return {
        day: x.day,
        status: x.status,
        time: x.time,
      };
    });
    console.log(result);
    return res.status(200).json({ status: 200, body: { year, month, employee, result } });
  }
});

module.exports = AddReportRouter;
