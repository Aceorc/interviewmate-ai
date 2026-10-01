const express = require('express');
const router = express.Router();
const { getTechnicalQuestions, evaluateAnswer } = require('../controllers/technicalController');
const { protect } = require('../middleware/auth');

router.get('/questions', protect, getTechnicalQuestions);
router.post('/evaluate', protect, evaluateAnswer);

module.exports = router;
