const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    questionId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

const MongooseBookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = getModel('Bookmark', MongooseBookmark);
