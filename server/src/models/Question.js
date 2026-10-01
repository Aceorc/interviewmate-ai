const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['aptitude', 'reasoning', 'technical', 'hr']
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      default: []
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // Can be index (0-3) or string answer
      default: null
    },
    marks: {
      type: Number,
      default: 10
    },
    explanation: {
      type: String,
      default: ''
    },
    sampleAnswer: {
      type: String,
      default: ''
    },
    codeSnippet: {
      type: String,
      default: ''
    },
    hints: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const MongooseQuestion = mongoose.model('Question', questionSchema);
module.exports = getModel('Question', MongooseQuestion);
