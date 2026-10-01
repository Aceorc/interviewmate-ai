const express = require('express');
const router = express.Router();
const { getHRQuestions, evaluateAnswer } = require('../controllers/hrController');
const { protect } = require('../middleware/auth');

router.get('/questions', protect, getHRQuestions);
router.post('/evaluate', protect, evaluateAnswer);

module.exports = router;
