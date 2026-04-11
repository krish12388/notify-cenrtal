const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: String, unique: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true, min: 1, max: 4 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

classroomSchema.index({ branch: 1, year: 1 });
classroomSchema.index({ teacher: 1 });

module.exports = mongoose.model('Classroom', classroomSchema);
