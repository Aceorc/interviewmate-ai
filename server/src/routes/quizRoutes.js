const express = require('express');
const router = express.Router();
const {
  getAptitudeQuestions,
  getReasoningQuestions,
  submitQuiz,
  getUserQuizHistory,
  getDashboardStats
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.get('/aptitude', protect, getAptitudeQuestions);
router.get('/reasoning', protect, getReasoningQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getUserQuizHistory);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
