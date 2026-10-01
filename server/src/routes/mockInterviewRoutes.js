const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById
} = require('../controllers/mockInterviewController');
const { protect } = require('../middleware/auth');

router.post('/start', protect, startInterview);
router.post('/:id/answer', protect, submitAnswer);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);

module.exports = router;
