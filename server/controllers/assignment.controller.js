const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Classroom = require('../models/Classroom');
const fs = require('fs');
const path = require('path');

// Create Assignment
exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, classroomId } = req.body;
    
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      classroomId,
      dueDate,
      createdBy: req.user.id,
      documentUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(error);
  }
};

// Get Assignments for a classroom
exports.getClassroomAssignments = async (req, res, next) => {
  try {
    const { classroomId } = req.params;
    const assignments = await Assignment.find({ classroomId }).populate('createdBy', 'name');
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    next(error);
  }
};

// Get Single Assignment
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'name').populate('classroomId');
    if (!assignment) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

// Submit Solution
exports.submitSolution = async (req, res, next) => {
  try {
    const { id: assignmentId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const existingSubmission = await Submission.findOne({ assignmentId, studentId: req.user.id });
    if (existingSubmission) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'You have already submitted a solution' });
    }

    const submission = await Submission.create({
      assignmentId,
      studentId: req.user.id,
      documentUrl: `/uploads/${req.file.filename}`
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(error);
  }
};

// Get all submissions for an assignment (Teacher)
exports.getAssignmentSubmissions = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const submissions = await Submission.find({ assignmentId: req.params.id }).populate('studentId', 'name email rollNumber branch year');
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    next(error);
  }
};

// Get my submission for an assignment (Student)
exports.getMySubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({ assignmentId: req.params.id, studentId: req.user.id });
    res.status(200).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};
