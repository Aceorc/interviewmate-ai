const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const { evaluateHRAnswer } = require('../services/aiService');

// @desc Get HR behavioral questions
// @route GET /api/hr/questions
const getHRQuestions = async (req, res) => {
  try {
    const query = await Question.find({ category: 'hr' });
    const list = query._data || query;

    return res.json({
      success: true,
      count: list.length,
      questions: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Evaluate HR answer with STAR feedback
// @route POST /api/hr/evaluate
const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, questionText, userAnswer } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an answer.' });
    }

    let qText = questionText || 'Tell me about yourself.';
    let configuredMarks = 25;

    if (questionId) {
      const q = await Question.findById(questionId);
      if (q) {
        qText = q.question;
        if (q.marks && Number(q.marks) > 0) {
          configuredMarks = Number(q.marks);
        }
      }
    }

    const evaluation = await evaluateHRAnswer({
      question: qText,
      userAnswer
    });

    const marksAwarded = evaluation.score === 0 ? 0 : Math.round((evaluation.score / 100) * configuredMarks);
    evaluation.marksAwarded = marksAwarded;
    evaluation.maxMarks = configuredMarks;

    // Save to quiz attempts for progress tracking
    await QuizAttempt.create({
      userId: req.user._id,
      category: 'hr',
      topic: 'Behavioral & Leadership',
      score: evaluation.score,
      totalScore: marksAwarded,
      maximumScore: configuredMarks,
      percentage: evaluation.score,
      totalQuestions: 1,
      answeredQuestions: 1,
      unansweredQuestions: 0,
      correctAnswers: evaluation.score >= 65 ? 1 : 0,
      incorrectAnswers: evaluation.score < 65 ? 1 : 0,
      timeSpentSeconds: 90,
      answers: [
        {
          questionId,
          questionText: qText,
          userAnswerText: userAnswer,
          feedback: evaluation.feedback,
          score: evaluation.score,
          marksAwarded,
          maxMarks: configuredMarks,
          isCorrect: evaluation.score >= 65,
          isValid: evaluation.score > 0
        }
      ]
    });

    return res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHRQuestions,
  evaluateAnswer
};
