const express = require('express');
const AddReportRouter = new express.Router();
const PromisePool = require('@supercharge/promise-pool');
const EmployeeModel = require('../../models/employeeModel');
const ReportModel = require('../../models/reportsModel');
const AttendanceModel = require('../../models/attendanceModel');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

AddReportRouter.post('/api/report/generate', async (req, res) => {
  const { report, start, end } = req.body;
  let fileName = `${new Date().getTime()}-${report}-generated-report.csv`;
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
          { id: 'created', title: 'Created Date' },
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
            created: new Date(details.created).toLocaleDateString(),
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
            created: new Date(details.created).toLocaleDateString(),
            role: details.role,
            department: details.department,
            email: details.email,
            month: details.month,
            year: details.year,
          };
          break;
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

module.exports = AddReportRouter;
