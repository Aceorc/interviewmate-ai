const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  toggleBookmark,
  getUserBookmarks
} = require('../controllers/questionBankController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllQuestions);
router.get('/bookmarks', protect, getUserBookmarks);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
