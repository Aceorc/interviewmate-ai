const multer = require('multer');
const path = require('path');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { parseResumeBuffer } = require('../services/resumeService');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDF resumes are supported.'));
    }
    cb(null, true);
  }
}).single('resume');

// @desc Upload and analyze resume PDF
// @route POST /api/resume/analyze
const uploadAndAnalyze = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
    }

    try {
      const parsedData = await parseResumeBuffer(
        req.file.buffer,
        req.file.originalname,
        req.file.size
      );

      const analysis = await ResumeAnalysis.create({
        userId: req.user._id,
        ...parsedData
      });

      return res.json({
        success: true,
        message: 'Resume analyzed successfully!',
        analysis
      });
    } catch (error) {
      console.error('Resume processing error:', error);
      return res.status(500).json({ success: false, message: 'Failed to analyze resume: ' + error.message });
    }
  });
};

// @desc Get user's latest resume analysis
// @route GET /api/resume/latest
const getLatestAnalysis = async (req, res) => {
  try {
    const query = await ResumeAnalysis.find({ userId: req.user._id });
    const list = query._data || query;
    if (list.length === 0) {
      return res.json({ success: true, analysis: null });
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({
      success: true,
      analysis: list[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's resume analysis history
// @route GET /api/resume/history
const getAnalysisHistory = async (req, res) => {
  try {
    const query = await ResumeAnalysis.find({ userId: req.user._id });
    const list = query._data || query;
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,
      analyses: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadAndAnalyze,
  getLatestAnalysis,
  getAnalysisHistory
};
