const express = require('express');
const { 
  createAssignment, 
  getClassroomAssignments, 
  getAssignmentById, 
  submitSolution, 
  getAssignmentSubmissions,
  getMySubmission 
} = require('../controllers/assignment.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.use(protect);

router.route('/classroom/:classroomId')
  .get(getClassroomAssignments)
  .post(upload.single('document'), createAssignment); // Teacher creates assignment

router.route('/:id')
  .get(getAssignmentById);

router.route('/:id/submit')
  .post(upload.single('document'), submitSolution);

router.route('/:id/submissions')
  .get(getAssignmentSubmissions); // Teacher gets all submissions

router.route('/:id/mysubmission')
  .get(getMySubmission); // Student gets their own submission

module.exports = router;
