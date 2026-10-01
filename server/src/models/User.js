const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    college: {
      type: String,
      required: [true, 'Please specify your college or university'],
      trim: true
    },
    degree: {
      type: String,
      required: [true, 'Please specify your degree'],
      trim: true
    },
    graduationYear: {
      type: Number,
      required: [true, 'Please specify your graduation year']
    },
    targetRole: {
      type: String,
      required: [true, 'Please specify your target job role'],
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    profilePhoto: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const MongooseUser = mongoose.model('User', userSchema);
module.exports = getModel('User', MongooseUser);
