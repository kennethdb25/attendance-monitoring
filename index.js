const express = require('express');
const path = require('path');
const cors = require('cors');
require('./database/conn');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000; // server port

//ROUTES IMPORT
const AdminRegRouter = require('./routes/signUpRoute/adminRegRoute');
const ForgotPassRouter = require('./routes/forgot-password/forgotPassword');
const SignInRouter = require('./routes/loginRoute/loginRoute');
const EmployeeRouter = require('./routes/addEmployeeRoute/employeeRoute');
const AddReportRouter = require('./routes/reportRoute/reportRoute');
const AttendanceRouter = require('./routes/attendanceRoute/attendanceRoute');
const DashboardRouter = require('./routes/dashboardRoute/dashboardRoute');

//ROUTES
app.use(AdminRegRouter);
app.use(ForgotPassRouter);
app.use(SignInRouter);
app.use(EmployeeRouter);
app.use(AddReportRouter);
app.use(AttendanceRouter);
app.use(DashboardRouter);

app.use('/file-uploads', express.static('./file-uploads'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
