const User = require('../models/User');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const MockInterview = require('../models/MockInterview');

// @desc Get Admin platform overview statistics
// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalQuizzes = await QuizAttempt.countDocuments();
    const totalMocks = await MockInterview.countDocuments();

    // Category breakdown
    const allQuestionsQuery = await Question.find();
    const allQuestions = allQuestionsQuery._data || allQuestionsQuery;

    const categoryBreakdown = {
      aptitude: allQuestions.filter(q => q.category === 'aptitude').length,
      reasoning: allQuestions.filter(q => q.category === 'reasoning').length,
      technical: allQuestions.filter(q => q.category === 'technical').length,
      hr: allQuestions.filter(q => q.category === 'hr').length
    };

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalQuestions,
        totalQuizzes,
        totalMocks,
        categoryBreakdown
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all registered students
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const usersQuery = await User.find();
    const users = usersQuery._data || usersQuery;

    const safeUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      college: u.college,
      degree: u.degree,
      graduationYear: u.graduationYear,
      targetRole: u.targetRole,
      role: u.role,
      createdAt: u.createdAt
    }));

    return res.json({
      success: true,
      count: safeUsers.length,
      users: safeUsers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add a new question to question bank
// @route POST /api/admin/questions
const createQuestion = async (req, res) => {
  try {
    const { category, topic, difficulty, question, options, correctAnswer, explanation, sampleAnswer, codeSnippet } = req.body;

    if (!category || !topic || !question) {
      return res.status(400).json({ success: false, message: 'Category, topic, and question text are required.' });
    }

    const newQuestion = await Question.create({
      category: category.toLowerCase(),
      topic,
      difficulty: difficulty || 'Medium',
      question,
      options: Array.isArray(options) ? options : [],
      correctAnswer: correctAnswer !== undefined ? correctAnswer : null,
      explanation: explanation || '',
      sampleAnswer: sampleAnswer || '',
      codeSnippet: codeSnippet || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Question added successfully to Question Bank!',
      question: newQuestion
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update existing question
// @route PUT /api/admin/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    return res.json({
      success: true,
      message: 'Question updated successfully!',
      question: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete question
// @route DELETE /api/admin/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    return res.json({
      success: true,
      message: 'Question deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
