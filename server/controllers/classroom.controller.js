const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Create a classroom (Teacher)
exports.createClassroom = async (req, res, next) => {
  try {
    const { name, branch, year } = req.body;
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to create classrooms' });
    }

    const classId = Math.random().toString(36).substring(2, 8).toUpperCase();

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
      const user = await User.findById(req.user.id);
      
      const branchRegex = user.branch ? new RegExp('^' + user.branch + '$', 'i') : null;
      
      query = {
        $or: [
          { branch: { $regex: branchRegex || /.*/ }, year: user.year }, // Automatic match
          { students: req.user.id } // Explicitly joined
        ]
      };
    }

    const classrooms = await Classroom.find(query).populate('teacher', 'name email');
    res.status(200).json({ success: true, classrooms });
  } catch (error) {
    next(error);
  }
};

// Get classroom by ID
exports.getClassroomById = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('teacher', 'name email');
    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
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

    const classroom = await Classroom.findOne({ classId: id });
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
