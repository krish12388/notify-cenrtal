// const User = require('../models/User'); // COMMENTED FOR POSTGRES MIGRATION
const pgdb = require('../config/pgdb');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
    */
    const { rows } = await pgdb.query('SELECT id, name, email, "rollNumber", branch, year, role, "notificationPreferences", "createdAt", "updatedAt" FROM users');
    res.status(200).json({ success: true, data: rows });
  } catch (error) { next(error); }
};

exports.getUserById = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
    */
    const { rows } = await pgdb.query('SELECT id, name, email, "rollNumber", branch, year, role, "notificationPreferences", "createdAt", "updatedAt" FROM users WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
    res.status(200).json({ success: true, data: user });
    */
    
    // Dynamic UPDATE query builder for Postgres
    const updates = [];
    const values = [];
    let counter = 1;

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && key !== 'password' && key !== 'role' && key !== 'id') {
        const dbKey = key === 'rollNumber' ? '"rollNumber"' : key === 'notificationPreferences' ? '"notificationPreferences"' : key;
        updates.push(`${dbKey} = $${counter}`);
        values.push(req.body[key]);
        counter++;
      }
    }

    if (updates.length === 0) {
      const { rows } = await pgdb.query('SELECT id, name, email, "rollNumber", branch, year, role, "notificationPreferences", "createdAt", "updatedAt" FROM users WHERE id = $1', [req.user.id]);
      return res.status(200).json({ success: true, data: rows[0] });
    }

    values.push(req.user.id);
    const updateQuery = `
      UPDATE users SET ${updates.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${counter}
      RETURNING id, name, email, "rollNumber", branch, year, role, "notificationPreferences", "createdAt", "updatedAt"
    `;

    const { rows } = await pgdb.query(updateQuery, values);
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    const user = await User.findById(req.user.id);
    const { currentPassword, newPassword } = req.body;
    
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password updated successfully' });
    */

    const { currentPassword, newPassword } = req.body;
    const { rows } = await pgdb.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pgdb.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
    */
    await pgdb.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.deleteMyAccount = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
    */
    await pgdb.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) { next(error); }
};
