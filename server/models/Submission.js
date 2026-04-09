const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentUrl: { type: String, required: true }, // student's PDF submission
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true }); // Prevent multiple submissions per student per assignment

module.exports = mongoose.model('Submission', submissionSchema);
