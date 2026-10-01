const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      default: 'General'
    },
    score: {
      type: Number,
      required: true
    },
    totalScore: {
      type: Number,
      default: 0
    },
    maximumScore: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    answeredQuestions: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    unansweredQuestions: {
      type: Number,
      default: 0
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.Mixed,
        questionText: String,
        selectedOption: mongoose.Schema.Types.Mixed,
        correctOption: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        isValid: Boolean,
        marksAwarded: Number,
        maxMarks: Number,
        userAnswerText: String,
        feedback: String,
        explanation: String
      }
    ]
  },
  { timestamps: true }
);

const MongooseQuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
module.exports = getModel('QuizAttempt', MongooseQuizAttempt);
