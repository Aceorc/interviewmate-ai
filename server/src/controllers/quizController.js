const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const MockInterview = require('../models/MockInterview');
const { validateMCQAnswer } = require('../utils/answerValidator');

// @desc Get Aptitude questions
// @route GET /api/quiz/aptitude
const getAptitudeQuestions = async (req, res) => {
  try {
    const { topic, difficulty, limit = 10 } = req.query;
    const filter = { category: 'aptitude' };

    if (topic && topic !== 'All') {
      filter.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const query = await Question.find(filter);
    const questions = query._data || query;

    // Shuffle and pick
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, Number(limit));

    // Return without revealing correctAnswer directly during active quiz
    const clientSafe = shuffled.map(q => ({
      _id: q._id,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      hints: q.hints || []
    }));

    return res.json({
      success: true,
      count: clientSafe.length,
      questions: clientSafe
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Logical Reasoning questions
// @route GET /api/quiz/reasoning
const getReasoningQuestions = async (req, res) => {
  try {
    const { topic, difficulty, limit = 10 } = req.query;
    const filter = { category: 'reasoning' };

    if (topic && topic !== 'All') {
      filter.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const query = await Question.find(filter);
    const questions = query._data || query;

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, Number(limit));

    const clientSafe = shuffled.map(q => ({
      _id: q._id,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      hints: q.hints || []
    }));

    return res.json({
      success: true,
      count: clientSafe.length,
      questions: clientSafe
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit Quiz Attempt
// @route POST /api/quiz/submit
const submitQuiz = async (req, res) => {
  try {
    const { category, topic, answers, timeSpentSeconds } = req.body;
    // answers: [ { questionId, selectedOption } ]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'No answers submitted.' });
    }

    let answeredQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unansweredQuestions = 0;
    let totalScore = 0;
    let maximumScore = 0;
    const detailedAnswers = [];

    for (const item of answers) {
      const q = await Question.findById(item.questionId);
      if (q) {
        // Validate submitted answer strictly against question options & correct answer
        // Client-sent score or marks are strictly ignored!
        const validation = validateMCQAnswer(q, item.selectedOption);

        if (validation.isAnswered) {
          answeredQuestions++;
          if (validation.isCorrect) {
            correctAnswers++;
            totalScore += validation.marksAwarded;
          } else {
            wrongAnswers++;
          }
        } else {
          unansweredQuestions++;
        }

        maximumScore += validation.maxMarks;

        detailedAnswers.push({
          questionId: q._id,
          questionText: q.question,
          selectedOption: item.selectedOption,
          correctOption: q.correctAnswer,
          isCorrect: validation.isCorrect,
          isValid: validation.isValid,
          marksAwarded: validation.marksAwarded,
          maxMarks: validation.maxMarks,
          userAnswerText: String(item.selectedOption ?? ''),
          explanation: q.explanation || ''
        });
      }
    }

    const totalQuestions = detailedAnswers.length;
    const percentage = maximumScore > 0 ? Math.round((totalScore / maximumScore) * 100) : 0;

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      category: category || 'aptitude',
      topic: topic || 'Mixed',
      score: percentage,
      totalScore,
      maximumScore,
      percentage,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers: wrongAnswers,
      unansweredQuestions,
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      answers: detailedAnswers
    });

    return res.json({
      success: true,
      message: 'Quiz evaluated and submitted successfully!',
      attemptId: attempt._id,
      score: percentage,
      totalScore,
      maximumScore,
      percentage,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      wrongAnswers,
      incorrectAnswers: wrongAnswers,
      unansweredQuestions,
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      detailedAnswers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user quiz history
// @route GET /api/quiz/history
const getUserQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id });
    const list = attempts._data || attempts;
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,
      attempts: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get dashboard aggregated statistics
// @route GET /api/quiz/dashboard-stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all quiz attempts for user
    const attemptsQuery = await QuizAttempt.find({ userId });
    const attempts = attemptsQuery._data || attemptsQuery;

    // Get all mock interviews for user
    const mocksQuery = await MockInterview.find({ userId });
    const mocks = mocksQuery._data || mocksQuery;

    const totalQuizzes = attempts.length;
    const totalMocks = mocks.filter(m => m.status === 'completed').length;

    let totalScore = 0;
    let aptitudeSum = 0;
    let aptitudeCount = 0;
    let reasoningSum = 0;
    let reasoningCount = 0;
    let techSum = 0;
    let techCount = 0;
    let hrSum = 0;
    let hrCount = 0;

    let totalQuestionsAnswered = 0;

    attempts.forEach(a => {
      totalScore += a.score;
      totalQuestionsAnswered += a.totalQuestions || 0;

      if (a.category === 'aptitude') {
        aptitudeSum += a.score;
        aptitudeCount++;
      } else if (a.category === 'reasoning') {
        reasoningSum += a.score;
        reasoningCount++;
      } else if (a.category === 'technical') {
        techSum += a.score;
        techCount++;
      } else if (a.category === 'hr') {
        hrSum += a.score;
        hrCount++;
      }
    });

    const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
    const aptitudeScore = aptitudeCount > 0 ? Math.round(aptitudeSum / aptitudeCount) : 0;
    const reasoningScore = reasoningCount > 0 ? Math.round(reasoningSum / reasoningCount) : 0;
    const technicalScore = techCount > 0 ? Math.round(techSum / techCount) : 0;
    const hrScore = hrCount > 0 ? Math.round(hrSum / hrCount) : 0;

    // Calculate Overall Placement Readiness Index (0-100)
    const weightedSum = Math.round(
      (aptitudeScore * 0.25) +
      (reasoningScore * 0.2) +
      (technicalScore * 0.3) +
      (hrScore * 0.15) +
      Math.min(totalMocks * 5, 10)
    );
    const readinessIndex = Math.min(
      totalQuizzes > 0 || totalMocks > 0 ? weightedSum : 0,
      100
    );

    // Recent activity combining quizzes and interviews
    const recentActivity = [
      ...attempts.map(a => ({
        id: a._id,
        type: 'Quiz',
        title: `${a.category.toUpperCase()}: ${a.topic}`,
        score: a.score,
        total: a.totalQuestions,
        date: a.createdAt
      })),
      ...mocks.map(m => ({
        id: m._id,
        type: 'Mock Interview',
        title: `${m.interviewType} Interview (${m.targetRole})`,
        score: m.overallScore,
        total: m.totalQuestions,
        date: m.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);

    return res.json({
      success: true,
      stats: {
        questionsCompleted: totalQuestionsAnswered,
        quizzesCompleted: totalQuizzes,
        mockInterviewsCompleted: totalMocks,
        averageScore,
        aptitudeScore,
        reasoningScore,
        technicalScore,
        hrScore,
        readinessIndex,
        recentActivity
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAptitudeQuestions,
  getReasoningQuestions,
  submitQuiz,
  getUserQuizHistory,
  getDashboardStats
};
