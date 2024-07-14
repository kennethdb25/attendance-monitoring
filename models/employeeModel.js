const mongoose = require('mongoose');
const validator = require('validator');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  employmentStatus: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  employerName: {
    type: String,
    required: true,
  },
  employerAddress: {
    type: String,
    required: true,
  },
  employerContact: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Not a valid email');
      }
    },
  },
});

const EmployeeModel = new mongoose.model('EmployeeInfo', EmployeeSchema);

module.exports = EmployeeModel;
