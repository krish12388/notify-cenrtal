const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notice: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true }
}, { timestamps: true });

bookmarkSchema.index({ user: 1, notice: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
