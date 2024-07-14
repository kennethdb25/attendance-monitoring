const mongoose = require('mongoose');
const validator = require('validator');

const AttendanceSchema = new mongoose.Schema({
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
  timeData: {
    timeInAM: {
      type: String,
    },
    timeOutAM: {
      type: String,
    },
    timeInPM: {
      type: String,
    },
    timeOutPM: {
      type: String,
    },
    totalHoursToday: {
      type: Number,
    },
  },

  created: {
    type: Date,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  monthCount: {
    type: Number,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  department: {
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
  email: {
    type: String,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Not a valid email');
      }
    },
  },
});

const AttendanceModel = new mongoose.model('AttendanceInfo', AttendanceSchema);

module.exports = AttendanceModel;
