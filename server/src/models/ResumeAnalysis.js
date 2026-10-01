const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      default: 0
    },
    overallScore: {
      type: Number,
      required: true
    },
    detectedSkills: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      tools: { type: [String], default: [] }
    },
    extractedInfo: {
      education: { type: [String], default: [] },
      projects: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      certifications: { type: [String], default: [] }
    },
    missingSections: {
      type: [String],
      default: []
    },
    strengths: {
      type: [String],
      default: []
    },
    areasToImprove: {
      type: [String],
      default: []
    },
    suggestedSkills: {
      type: [String],
      default: []
    },
    suggestedProjects: {
      type: [String],
      default: []
    },
    suggestedInterviewQuestions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const MongooseResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
module.exports = getModel('ResumeAnalysis', MongooseResumeAnalysis);
