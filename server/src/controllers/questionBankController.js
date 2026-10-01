const Question = require('../models/Question');
const Bookmark = require('../models/Bookmark');

// @desc Get searchable question bank
// @route GET /api/questions
const getAllQuestions = async (req, res) => {
  try {
    const { category, topic, difficulty, search = '', page = 1, limit = 50 } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category.toLowerCase();
    }
    if (topic && topic !== 'All') {
      filter.topic = topic;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const query = await Question.find(filter);
    let list = query._data || query;

    // Filter by search query if provided
    if (search.trim()) {
      const s = search.toLowerCase().trim();
      list = list.filter(q =>
        (q.question && q.question.toLowerCase().includes(s)) ||
        (q.topic && q.topic.toLowerCase().includes(s)) ||
        (q.category && q.category.toLowerCase().includes(s))
      );
    }

    // Attach bookmark info if user logged in
    const userBookmarks = await Bookmark.find({ userId: req.user._id });
    const bookmarkedSet = new Set((userBookmarks._data || userBookmarks).map(b => String(b.questionId)));

    const result = list.map(q => ({
      ...q,
      isBookmarked: bookmarkedSet.has(String(q._id))
    }));

    return res.json({
      success: true,
      count: result.length,
      questions: result
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle bookmark on a question
// @route POST /api/questions/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user._id;

    const existing = await Bookmark.findOne({ userId, questionId });
    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.json({ success: true, isBookmarked: false, message: 'Removed from bookmarks.' });
    } else {
      await Bookmark.create({ userId, questionId });
      return res.json({ success: true, isBookmarked: true, message: 'Added to bookmarks!' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's bookmarked questions
// @route GET /api/questions/bookmarks
const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id });
    const bList = bookmarks._data || bookmarks;

    const questions = [];
    for (const b of bList) {
      const q = await Question.findById(b.questionId);
      if (q) {
        questions.push({ ...q, isBookmarked: true });
      }
    }

    return res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllQuestions,
  toggleBookmark,
  getUserBookmarks
};
