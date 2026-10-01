const express = require('express');
const router = express.Router();
const {
  uploadAndAnalyze,
  getLatestAnalysis,
  getAnalysisHistory
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, uploadAndAnalyze);
router.get('/latest', protect, getLatestAnalysis);
router.get('/history', protect, getAnalysisHistory);

module.exports = router;
