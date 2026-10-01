const MockInterview = require('../models/MockInterview');
const Question = require('../models/Question');
const { evaluateMockStep, generateFinalMockReport } = require('../services/aiService');

// Starter question pools based on role and type
const STARTER_QUESTIONS = {
  Technical: {
    'Full Stack Software Engineer': "Can you explain the life-cycle of a web request from the moment you type a URL into a browser until the page renders, specifically how client, server, and database interact?",
    'Frontend Developer': "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR), and how the Virtual DOM minimizes expensive DOM operations.",
    'Backend Developer': "How would you design a scalable RESTful API with proper caching, database indexing, and rate limiting for high-concurrency traffic?",
    'Data Analyst': "Explain how you handle missing data in a dataset and the trade-offs between imputation and dropping records.",
    default: "Can you explain the core differences between a process and a thread, and how memory is allocated between stack and heap?"
  },
  HR: {
    default: "Tell me about yourself, your academic background, and why you are interested in starting your career with our engineering team."
  },
  Mixed: {
    default: "Could you introduce yourself and walk me through a technical project you built that you are most proud of?"
  }
};

// @desc Start a new AI Mock Interview
// @route POST /api/mock-interview/start
const startInterview = async (req, res) => {
  try {
    const { targetRole, experienceLevel = 'Fresher', interviewType = 'Technical', totalQuestions = 5 } = req.body;

    if (!targetRole) {
      return res.status(400).json({ success: false, message: 'Please specify your target job role.' });
    }

    const initialQ = (STARTER_QUESTIONS[interviewType] && STARTER_QUESTIONS[interviewType][targetRole]) ||
      (STARTER_QUESTIONS[interviewType] && STARTER_QUESTIONS[interviewType].default) ||
      STARTER_QUESTIONS.Technical.default;

    const interview = await MockInterview.create({
      userId: req.user._id,
      targetRole,
      experienceLevel,
      interviewType,
      totalQuestions: Math.min(Math.max(Number(totalQuestions) || 5, 2), 10),
      status: 'in_progress',
      dialogue: [
        {
          questionNumber: 1,
          questionText: initialQ,
          userAnswer: '',
          aiFeedback: '',
          score: 0,
          followUpQuestion: ''
        }
      ]
    });

    return res.status(201).json({
      success: true,
      interviewId: interview._id,
      currentQuestionIndex: 1,
      totalQuestions: interview.totalQuestions,
      questionText: initialQ,
      targetRole,
      interviewType,
      experienceLevel
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit answer to current question, evaluate, and get next question / follow-up
// @route POST /api/mock-interview/:id/answer
const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { userAnswer, currentQuestionNumber } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an answer.' });
    }

    const interview = await MockInterview.findById(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    const currentStep = interview.dialogue.find(d => d.questionNumber === Number(currentQuestionNumber));
    if (!currentStep) {
      return res.status(400).json({ success: false, message: 'Invalid question step.' });
    }

    // AI Evaluation
    const evaluation = await evaluateMockStep({
      role: interview.targetRole,
      experienceLevel: interview.experienceLevel,
      interviewType: interview.interviewType,
      question: currentStep.questionText,
      userAnswer,
      questionNumber: Number(currentQuestionNumber),
      totalQuestions: interview.totalQuestions
    });

    currentStep.userAnswer = userAnswer.trim();
    currentStep.aiFeedback = evaluation.feedback;
    currentStep.score = evaluation.score;
    currentStep.followUpQuestion = evaluation.followUpQuestion;

    const isFinished = Number(currentQuestionNumber) >= interview.totalQuestions;

    if (isFinished) {
      interview.status = 'completed';
      // Generate final comprehensive report
      const finalReport = await generateFinalMockReport({
        role: interview.targetRole,
        experienceLevel: interview.experienceLevel,
        interviewType: interview.interviewType,
        dialogue: interview.dialogue
      });

      interview.overallScore = finalReport.overallScore;
      interview.scores = finalReport.scores;
      interview.strengths = finalReport.strengths;
      interview.areasToImprove = finalReport.areasToImprove;
      interview.recommendedTopics = finalReport.recommendedTopics;

      await interview.save();

      return res.json({
        success: true,
        isCompleted: true,
        feedback: evaluation.feedback,
        score: evaluation.score,
        finalReport: {
          overallScore: interview.overallScore,
          scores: interview.scores,
          strengths: interview.strengths,
          areasToImprove: interview.areasToImprove,
          recommendedTopics: interview.recommendedTopics,
          dialogue: interview.dialogue
        }
      });
    } else {
      const nextQNum = Number(currentQuestionNumber) + 1;
      const nextQuestionText = evaluation.followUpQuestion || `Tell me about a complex challenge you solved related to ${interview.targetRole}.`;

      interview.dialogue.push({
        questionNumber: nextQNum,
        questionText: nextQuestionText,
        userAnswer: '',
        aiFeedback: '',
        score: 0,
        followUpQuestion: ''
      });

      await interview.save();

      return res.json({
        success: true,
        isCompleted: false,
        feedback: evaluation.feedback,
        score: evaluation.score,
        nextQuestion: {
          questionNumber: nextQNum,
          questionText: nextQuestionText,
          totalQuestions: interview.totalQuestions
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get interview history
// @route GET /api/mock-interview/history
const getInterviewHistory = async (req, res) => {
  try {
    const listQuery = await MockInterview.find({ userId: req.user._id });
    const list = listQuery._data || listQuery;
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,
      interviews: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get interview by ID
// @route GET /api/mock-interview/:id
const getInterviewById = async (req, res) => {
  try {
    const interview = await MockInterview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Mock interview not found.' });
    }

    return res.json({
      success: true,
      interview
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById
};
