const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    targetRole: {
      type: String,
      required: true
    },
    experienceLevel: {
      type: String,
      default: 'Fresher'
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'HR', 'Mixed'],
      default: 'Technical'
    },
    totalQuestions: {
      type: Number,
      default: 5
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
    },
    overallScore: {
      type: Number,
      default: 0
    },
    scores: {
      technicalKnowledge: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      confidenceClarity: { type: Number, default: 0 }
    },
    dialogue: [
      {
        questionNumber: Number,
        questionText: String,
        userAnswer: String,
        aiFeedback: String,
        score: Number,
        followUpQuestion: String,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    strengths: {
      type: [String],
      default: []
    },
    areasToImprove: {
      type: [String],
      default: []
    },
    recommendedTopics: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const MongooseMockInterview = mongoose.model('MockInterview', mockInterviewSchema);
module.exports = getModel('MockInterview', MongooseMockInterview);
