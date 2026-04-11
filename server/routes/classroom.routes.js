const express = require('express');
const { createClassroom, getClassrooms, getClassroomById, joinClassroom, deleteClassroom } = require('../controllers/classroom.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // All classroom routes are protected

router.post('/', createClassroom);
router.get('/', getClassrooms);

router.post('/join', joinClassroom);

router.get('/:id', getClassroomById);
router.delete('/:id', deleteClassroom);

module.exports = router;
