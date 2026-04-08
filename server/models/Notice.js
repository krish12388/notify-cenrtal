const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Exam', 'Event', 'Holiday', 'Urgent', 'General'],
    default: 'General'
  },
  targetAudience: {
    type: { type: String, enum: ['all', 'branch', 'year'], default: 'all' },
    branch: { type: String },
    year: { type: Number }
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String
  }],
  priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

noticeSchema.index({ title: 'text', description: 'text' });
noticeSchema.index({ category: 1, isActive: 1, expiryDate: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
