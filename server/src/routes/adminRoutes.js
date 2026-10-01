const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;
