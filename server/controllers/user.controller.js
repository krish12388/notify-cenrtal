const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) { next(error); }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { currentPassword, newPassword } = req.body;
    
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.deleteMyAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) { next(error); }
};
