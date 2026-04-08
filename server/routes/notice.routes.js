const express = require('express');
const { createNotice, getNotices, getNoticeById, updateNotice, deleteNotice, archiveNotice } = require('../controllers/notice.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const { check } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.route('/')
  .get(getNotices)
  .post(
    protect, 
    authorize('cr', 'admin'), 
    upload.array('files', 5), 
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ], 
    validate, 
    createNotice
  );

router.route('/:id')
  .get(getNoticeById)
  .put(protect, authorize('cr', 'admin'), updateNotice)
  .delete(protect, authorize('cr', 'admin'), deleteNotice);

router.patch('/:id/archive', protect, authorize('admin'), archiveNotice);

module.exports = router;
