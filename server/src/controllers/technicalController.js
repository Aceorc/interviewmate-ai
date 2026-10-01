const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const { evaluateTechnicalAnswer } = require('../services/aiService');

// @desc Get technical questions for a topic
// @route GET /api/technical/questions
const getTechnicalQuestions = async (req, res) => {
  try {
    const { topic = 'Java', difficulty } = req.query;
    const filter = { category: 'technical', topic };

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const query = await Question.find(filter);
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

// @desc Evaluate user's technical answer with AI
// @route POST /api/technical/evaluate
const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, topic, userAnswer } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ success: false, message: 'Please write an answer before submitting for evaluation.' });
    }

    let questionText = 'Explain this concept.';
    let sampleAnswer = '';
    let codeSnippet = '';
    let configuredMarks = 50;

    if (questionId) {
      const q = await Question.findById(questionId);
      if (q) {
        questionText = q.question;
        sampleAnswer = q.sampleAnswer || q.explanation;
        codeSnippet = q.codeSnippet || '';
        if (q.marks && Number(q.marks) > 0) {
          configuredMarks = Number(q.marks);
        }
      }
    }

    const evaluation = await evaluateTechnicalAnswer({
      topic: topic || 'General Technical',
      question: questionText,
      userAnswer,
      sampleAnswer,
      codeSnippet
    });

    const marksAwarded = evaluation.score === 0 ? 0 : Math.round((evaluation.score / 100) * configuredMarks);
    evaluation.marksAwarded = marksAwarded;
    evaluation.maxMarks = configuredMarks;

    // Save as quiz attempt for progress tracking
    await QuizAttempt.create({
      userId: req.user._id,
      category: 'technical',
      topic: topic || 'Technical',
      score: evaluation.score,
      totalScore: marksAwarded,
      maximumScore: configuredMarks,
      percentage: evaluation.score,
      totalQuestions: 1,
      answeredQuestions: 1,
      unansweredQuestions: 0,
      correctAnswers: evaluation.score >= 60 ? 1 : 0,
      incorrectAnswers: evaluation.score < 60 ? 1 : 0,
      timeSpentSeconds: 60,
      answers: [
        {
          questionId,
          questionText,
          userAnswerText: userAnswer,
          feedback: evaluation.feedback,
          score: evaluation.score,
          marksAwarded,
          maxMarks: configuredMarks,
          isCorrect: evaluation.score >= 60,
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
  getTechnicalQuestions,
  evaluateAnswer
};
