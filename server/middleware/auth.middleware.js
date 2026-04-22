const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // COMMENTED FOR POSTGRES MIGRATION
const pgdb = require('../config/pgdb');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      /* COMMENTED FOR POSTGRES MIGRATION
      req.user = await User.findById(decoded.id).select('-password');
      */
      const { rows } = await pgdb.query('SELECT id, name, email, "rollNumber", branch, year, role, "notificationPreferences", "createdAt", "updatedAt" FROM users WHERE id = $1', [decoded.id]);
      if (rows.length === 0) {
        throw new Error('User not found');
      }
      req.user = rows[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
