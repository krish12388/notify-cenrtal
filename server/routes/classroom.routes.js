const express = require('express');
const { createClassroom, getClassrooms, getClassroomById, joinClassroom } = require('../controllers/classroom.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // All classroom routes are protected

router.post('/', createClassroom);
router.get('/', getClassrooms);

router.post('/join', joinClassroom);

router.route('/:id')
  .get(getClassroomById);

module.exports = router;
