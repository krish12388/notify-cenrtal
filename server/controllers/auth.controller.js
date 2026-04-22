// const User = require('../models/User'); // COMMENTED FOR POSTGRES MIGRATION
const pgdb = require('../config/pgdb');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, branch, year, role } = req.body;
    
    /* COMMENTED FOR POSTGRES MIGRATION
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });
    
    user = await User.create({ name, email, password, rollNumber, branch, year, role });
    
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id)
    });
    */

    // POSTGRES IMPLEMENTATION
    const { rows } = await pgdb.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) return res.status(400).json({ success: false, message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newId = pgdb.generateId(); // Generate an ObjectId-like string

    const insertQuery = `
      INSERT INTO users (id, name, email, password, "rollNumber", branch, year, role) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const insertValues = [newId, name, email, hashedPassword, rollNumber, branch, year, role || 'student'];
    const { rows: insertedRows } = await pgdb.query(insertQuery, insertValues);
    const user = insertedRows[0];

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user.id)
    });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    /* COMMENTED FOR POSTGRES MIGRATION
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id)
    });
    */

    // POSTGRES IMPLEMENTATION
    const { rows } = await pgdb.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user.id)
    });
  } catch (error) { next(error); }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res, next) => {
  try {
    /* COMMENTED FOR POSTGRES MIGRATION
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
    */

    // POSTGRES IMPLEMENTATION
    const { rows } = await pgdb.query('SELECT id, name, email, "rollNumber", branch, year, role, "notificationPreferences", "createdAt", "updatedAt" FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user: rows[0] });
  } catch (error) { next(error); }
};
