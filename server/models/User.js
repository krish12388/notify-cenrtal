const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNumber: { type: String },
  branch: { type: String },
  year: { type: Number, min: 1, max: 4 },
  role: { type: String, enum: ['student', 'cr', 'admin'], default: 'student' },
  notificationPreferences: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.index({ email: 1, rollNumber: 1 }, { unique: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
