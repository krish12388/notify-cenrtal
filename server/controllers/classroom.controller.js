const Classroom = require('../models/Classroom');
// const User = require('../models/User'); // COMMENTED FOR POSTGRES MIGRATION
const pgdb = require('../config/pgdb');

// Create a classroom (Teacher)
exports.createClassroom = async (req, res, next) => {
  try {
    const { name, branch, year } = req.body;
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to create classrooms' });
    }

    const classId = Math.random().toString(36).substring(2, 7).toUpperCase();

    const classroom = await Classroom.create({
      name,
      classId,
      branch,
      year,
      teacher: req.user.id
    });

    res.status(201).json({ success: true, classroom });
  } catch (error) {
    next(error);
  }
};

// Get classrooms
exports.getClassrooms = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') {
      query.teacher = req.user.id;
    } else if (req.user.role === 'student' || req.user.role === 'cr') {
      query = { students: req.user.id };
    }

    // const classrooms = await Classroom.find(query).populate('teacher', 'name email'); // COMMENTED FOR POSTGRES MIGRATION
    const classrooms = await Classroom.find(query).lean();
    
    const teacherIds = [...new Set(classrooms.map(c => c.teacher?.toString()))];
    if (teacherIds.length > 0) {
      const { rows: users } = await pgdb.query('SELECT id, name, email FROM users WHERE id = ANY($1::varchar[])', [teacherIds]);
      const userMap = {};
      users.forEach(u => userMap[u.id] = { _id: u.id, name: u.name, email: u.email });
      
      classrooms.forEach(c => {
        c.teacher = userMap[c.teacher?.toString()] || c.teacher;
      });
    }

    res.status(200).json({ success: true, classrooms });
  } catch (error) {
    next(error);
  }
};

// Get classroom by ID
exports.getClassroomById = async (req, res, next) => {
  try {
    // const classroom = await Classroom.findById(req.params.id).populate('teacher', 'name email'); // COMMENTED FOR POSTGRES MIGRATION
    const classroom = await Classroom.findById(req.params.id).lean();
    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    const { rows: users } = await pgdb.query('SELECT id, name, email FROM users WHERE id = $1', [classroom.teacher?.toString()]);
    if (users.length > 0) {
      classroom.teacher = { _id: users[0].id, name: users[0].name, email: users[0].email };
    }

    res.status(200).json({ success: true, classroom });
  } catch (error) {
    next(error);
  }
};

// Join a classroom
exports.joinClassroom = async (req, res, next) => {
  try {
    const { id } = req.body;
    
    if (req.user.role !== 'student' && req.user.role !== 'cr') {
      return res.status(403).json({ success: false, message: 'Only students can join classrooms manually' });
    }

    const mongoose = require('mongoose');
    let classroom = await Classroom.findOne({ classId: id });
    
    if (!classroom && mongoose.Types.ObjectId.isValid(id)) {
      classroom = await Classroom.findById(id);
    }
    
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found. Please check the ID.' });

    if (!classroom.students.includes(req.user.id)) {
      classroom.students.push(req.user.id);
      await classroom.save();
    }
    
    res.status(200).json({ success: true, message: 'Joined classroom successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a classroom
exports.deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ success: false, message: 'Classroom not found' });

    // Ensure user is admin OR the teacher who created it
    if (req.user.role !== 'admin' && classroom.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this classroom' });
    }

    await Classroom.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Classroom deleted successfully' });
  } catch (error) {
    next(error);
  }
};
